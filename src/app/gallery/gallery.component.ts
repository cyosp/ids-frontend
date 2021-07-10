import {AfterViewInit, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {TokenStorageService} from '../token-storage.service';
import {AuthenticationService} from '../authentication.service';
import {ListQuery} from '../list-query.service';
import {environment} from '../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import 'hammerjs';
import {Subscription} from 'rxjs';
import {SharedDataService} from '../shared-data.service';

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit, OnDestroy, AfterViewInit {
    readonly THUMBNAIL_SIZE = 200;

    readonly LEFT_DIRECTION = 'Left';
    readonly RIGHT_DIRECTION = 'Right';

    isAuthenticated = false;
    isLoginFailed = false;
    fileSystemElements: any[] = [];
    previewImageIndex: any;
    previewImages: any[] = [];
    previewImageRatio: number;
    previewImageClassName: string;
    breakpoint: number;
    galleryPreviewWidth: number;
    galleryPreviewHeight: number;
    galleryPreviewRatio: number;
    navbarHeight: number;

    imageUrlPath: string;
    subscription: Subscription;

    constructor(private tokenStorageService: TokenStorageService,
                private authenticationService: AuthenticationService,
                private userListQuery: ListQuery,
                public router: Router,
                private route: ActivatedRoute,
                private sharedDataService: SharedDataService) {
    }

    @HostListener('window:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): any {
        switch (event.key) {
            case 'ArrowLeft':
                this.changePreview(this.LEFT_DIRECTION);
                break;
            case 'ArrowRight':
                this.changePreview(this.RIGHT_DIRECTION);
                break;
        }
    }

    private changePreview(direction: string): any {
        if (this.previewImages.length !== 0) {
            const NO_NEW_INDEX = -1;
            let newIndex = NO_NEW_INDEX;
            switch (direction) {
                case this.LEFT_DIRECTION:
                    if (this.previewImageIndex > 0) {
                        newIndex = this.previewImageIndex - 1;
                    }
                    break;
                case this.RIGHT_DIRECTION:
                    if (this.previewImageIndex < this.previewImages.length - 1) {
                        newIndex = this.previewImageIndex + 1;
                    }
                    break;
            }
            if (newIndex !== NO_NEW_INDEX) {
                this.router.navigate(['/gallery/' + this.previewImages[newIndex].id]);
            }
        }
    }

    ngOnInit(): void {
        this.subscription = this.sharedDataService.imageUrlPath.subscribe(imageUrlPath => this.imageUrlPath = imageUrlPath);

        this.breakpoint = (window.innerWidth / this.THUMBNAIL_SIZE);
        this.isAuthenticated = this.tokenStorageService.hasTokenNonExpired();

        this.route.url.subscribe(
            val => {
                this.fileSystemElements = [];
                this.previewImageIndex = null;
                this.previewImages = [];
                this.updateFileSystemElements();
            }
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private computeGalleryPreviewDimensions(): void {
        this.galleryPreviewWidth = window.innerWidth;
        this.galleryPreviewHeight = window.innerHeight - this.navbarHeight;
        this.galleryPreviewRatio = this.galleryPreviewWidth / this.galleryPreviewHeight;
    }

    ngAfterViewInit(): void {
        this.navbarHeight = document.getElementById('navbar').offsetHeight;
        this.computeGalleryPreviewDimensions();
    }

    private updateFileSystemElements(): any {
        const path = decodeURI(this.router.url);
        let directoryId = null;
        let imageName = null;
        if (path !== '/gallery') {
            directoryId = path.replace(/\/gallery\//, '');
        }
        if (directoryId) {
            directoryId = directoryId.replace(/>/g, '/');
        }
        if (directoryId) {
            const directoryIdPipeSplitted = directoryId.split('|');
            directoryId = directoryIdPipeSplitted[0];
            imageName = directoryIdPipeSplitted[1];
        }
        this.getPhotos(directoryId, imageName);
    }

    onResize(event): any {
        this.breakpoint = (event.target.innerWidth / this.THUMBNAIL_SIZE);
    }

    private getPathAndFileNameSplitted(fileSystemElement: any): string {
        return fileSystemElement.id.replace(new RegExp('/?(' + fileSystemElement.name + ')'), '|$1');
    }

    private replacePathSeparators(fileSystemPath: string): string {
        return fileSystemPath.replace(/\//g, '>');
    }

    getPhotos(directoryId: string, imageName: string): void {
        const queryVariables: any = {
            directoryReversedOrder: environment.directoryReversedOrder,
            previewDirectoryReversedOrder: environment.previewDirectoryReversedOrder,
        };
        if (directoryId) {
            queryVariables.directoryId = directoryId;
        }
        this.userListQuery.fetch(queryVariables).subscribe(data => {
                const directoryCount = (data as any).data.list
                    .filter(fse => fse.__typename === 'Directory')
                    .length;
                if (imageName) {
                    let imageIndex = 0;
                    this.previewImages = this.previewImages.concat((data as any).data.list
                        .filter(fse => fse.__typename === 'Image')
                        .map(fse => {
                                if (fse.name === imageName) {
                                    this.previewImageIndex = imageIndex;
                                    this.sharedDataService.setImageUrlPath(environment.backEndLocation + fse.urlPath);
                                }
                                imageIndex++;

                                return {
                                    id: this.replacePathSeparators(this.getPathAndFileNameSplitted(fse)),
                                    name: fse.name,
                                    previewUrlPath: environment.backEndLocation + fse.previewUrlPath
                                };
                            }
                        ));
                } else {
                    this.fileSystemElements = this.fileSystemElements.concat((data as any).data.list
                        .filter(fse => fse.__typename === 'Directory' && fse.elements.length > 0
                            || fse.__typename === 'Image'
                            && (directoryCount > 0 && environment.mixDirectoriesAndImages || directoryCount === 0)
                        )
                        .map(fse => {
                            let fseThumbnailUrl = environment.backEndLocation;
                            let id;
                            if (fse.__typename === 'Directory') {
                                if (fse.preview) {
                                    fseThumbnailUrl += fse.preview.thumbnailUrlPath;
                                } else {
                                    fseThumbnailUrl = null;
                                }
                                id = fse.id;
                            } else {
                                fseThumbnailUrl += fse.thumbnailUrlPath;
                                id = this.getPathAndFileNameSplitted(fse);
                            }
                            return {
                                id: this.replacePathSeparators(id),
                                name: fse.name,
                                type: fse.__typename,
                                thumbnailUrl: fseThumbnailUrl
                            };
                        }));
                }
            }
        );
    }

    onGalleryPreviewResize(): any {
        this.computeGalleryPreviewDimensions();
        this.computePreviewImageClassName();
    }

    onSwipeLeft(): void {
        this.changePreview(this.RIGHT_DIRECTION);
    }

    onSwipeRight(): void {
        this.changePreview(this.LEFT_DIRECTION);
    }

    onPreviewImageLoaded(previewImage): void {
        this.previewImageRatio = previewImage.naturalWidth / previewImage.naturalHeight;
        this.computePreviewImageClassName();
    }

    computePreviewImageClassName(): void {
        let classNameSuffix = 'height';
        if (this.previewImageRatio > this.galleryPreviewRatio) {
            classNameSuffix = 'width';
        }
        this.previewImageClassName = 'gallery-preview-full-' + classNameSuffix;
    }
}
