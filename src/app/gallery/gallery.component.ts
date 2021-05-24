import {AfterViewInit, Component, OnInit} from '@angular/core';
import {TokenStorageService} from '../token-storage.service';
import {AuthenticationService} from '../authentication.service';
import {ListQuery} from '../list-query.service';
import {environment} from '../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit, AfterViewInit {
    readonly THUMBNAIL_SIZE = 200;

    isAuthenticated = false;
    isLoginFailed = false;
    fileSystemElements: any[] = [];
    previewImageIndex: any;
    previewImages: any[] = [];
    breakpoint: number;
    galleryPreviewHeight: number;
    navbarHeight: number;

    constructor(private tokenStorageService: TokenStorageService,
                private authenticationService: AuthenticationService,
                private userListQuery: ListQuery,
                public router: Router,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
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

    private computeGalleryPreviewHeight(): void {
        this.galleryPreviewHeight = window.innerHeight - this.navbarHeight;
    }

    ngAfterViewInit(): void {
        this.navbarHeight = document.getElementById('navbar').offsetHeight;
        this.computeGalleryPreviewHeight();
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
        return fileSystemElement.id.replace(new RegExp('/(' + fileSystemElement.name + ')'), '|$1');
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
        this.computeGalleryPreviewHeight();
    }
}
