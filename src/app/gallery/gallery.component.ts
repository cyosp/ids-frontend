import {AfterViewInit, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../user.service';
import {AuthenticationService} from '../authentication.service';
import {ListQuery} from '../list-query.service';
import {ListQueryWithMetadata} from '../list-with-metadata-query.service';
import {GetImagesQuery} from '../getImages-query.service';
import {environment} from '../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import 'hammerjs';
import {Subscription} from 'rxjs';
import {SharedDataService} from '../shared-data.service';
import {UrlService} from '../url.service';
import {Constants} from '../constants';
import {FileSystemElementService} from '../file-system-element.service';
import {DeleteModalComponent} from '../delete-modal/delete-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DeleteImageMutationService} from '../delete-image-mutation.service';
import {ToastNotificationService} from '../toast-notification.service';
import {DirectoryService} from '../directory.service';

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit, OnDestroy, AfterViewInit {
    readonly THUMBNAIL_SIZE = Constants.THUMBNAIL_SIZE;

    readonly LEFT_DIRECTION = 'Left';
    readonly RIGHT_DIRECTION = 'Right';

    isAuthenticated = false;
    isAdministrator = false;
    displayWaitSpinner = false;
    hasServerResponded = false;
    fileSystemElements: any[] = [];
    previewImageIndex: any;
    previewImages: any[] = [];
    previewImageRatio: number;
    previewImageClassName: string;
    addTakenDateOnThumbnails: boolean;
    breakpoint: number;
    galleryPreviewWidth: number;
    galleryPreviewHeight: number;
    galleryPreviewRatio: number;
    navbarHeight: number;

    imageUrlPath: string;
    subscription: Subscription;

    constructor(private userService: UserService,
                private authenticationService: AuthenticationService,
                private userListQuery: ListQuery,
                private userListWithMetadataQuery: ListQueryWithMetadata,
                private getImagesQuery: GetImagesQuery,
                public router: Router,
                private route: ActivatedRoute,
                private sharedDataService: SharedDataService,
                private urlService: UrlService,
                private fileSystemElementService: FileSystemElementService,
                private ngbModal: NgbModal,
                private deleteImageMutationService: DeleteImageMutationService,
                private toastNotificationService: ToastNotificationService,
                private directoryService: DirectoryService) {
        this.addTakenDateOnThumbnails = environment.addTakenDateOnThumbnails;
    }

    @HostListener('window:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): any {
        switch (event.key) {
            case 'ArrowLeft':
                this.changePreview(this.LEFT_DIRECTION);
                break;
            case 'ArrowUp':
                this.previewLevelUp();
                break;
            case 'ArrowRight':
                this.changePreview(this.RIGHT_DIRECTION);
                break;
            case 'Delete':
                this.openDeleteModal(this.previewImages[this.previewImageIndex]);
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

    private previewLevelUp(): any {
        const decodedInfos = this.urlService.decodePath();
        const directories = decodedInfos.directories;
        let levelUpDirectoryIndex = directories.length - 1;
        if (decodedInfos.imageName === undefined) {
            levelUpDirectoryIndex--;
        }
        let directoryCommand = '';
        if (levelUpDirectoryIndex >= 0) {
            directoryCommand = Constants.SLASH_CHARACTER + directories[levelUpDirectoryIndex].id;
        }
        this.router.navigate(['/gallery' + directoryCommand]);
    }

    ngOnInit(): void {
        this.subscription = this.sharedDataService.imageUrlPath.subscribe(imageUrlPath => this.imageUrlPath = imageUrlPath);

        this.breakpoint = (window.innerWidth / this.THUMBNAIL_SIZE);
        this.isAuthenticated = this.userService.hasTokenNonExpired();
        this.isAdministrator = this.userService.isAdministrator();

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
            directoryId = directoryId.replace(/>/g, Constants.SLASH_CHARACTER);
        }
        if (directoryId) {
            const directoryIdPipeSplitted = directoryId.split(Constants.PIPE_CHARACTER);
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
        return fileSystemPath.replace(/\//g, Constants.GREATER_THAN_CHARACTER);
    }

    getPhotos(directoryId: string, imageName: string): void {
        this.displayWaitSpinner = false;
        this.hasServerResponded = false;
        setTimeout(() => {
            if (!this.hasServerResponded) {
                this.displayWaitSpinner = true;
            }
        }, 200);

        if (imageName) {
            this.getImagesQuery.fetch({
                directoryId,
                imageId: imageName
            }).subscribe(data => {
                this.hasServerResponded = true;
                this.displayWaitSpinner = false;

                const images = (data as any).data.getImages;
                this.previewImageIndex = images[0] == null ? 0 : 1;
                this.sharedDataService.setImageUrlPath(environment.backEndLocation + images[1].urlPath);

                this.previewImages = this.previewImages.concat(images
                    .filter(image => image != null)
                    .map(image => {
                        const fileSystemElement = {
                            id: this.replacePathSeparators(this.getPathAndFileNameSplitted(image)),
                            name: image.name,
                            previewUrlPath: environment.backEndLocation + image.previewUrlPath,
                            previewImageLoading: false,
                            previewImageLoaded: false
                        };

                        setTimeout(() => {
                            if (!fileSystemElement.previewImageLoaded) {
                                fileSystemElement.previewImageLoading = true;
                            }
                        }, 200);

                        return fileSystemElement;
                    }));
                document.body.style.overflow = 'hidden';
            });
        } else {
            const queryVariables: any = {
                directoryReversedOrder: environment.directoryReversedOrder,
                previewDirectoryReversedOrder: environment.previewDirectoryReversedOrder,
            };
            if (directoryId) {
                queryVariables.directoryId = directoryId;
            }
            const listQuery = this.addTakenDateOnThumbnails ? this.userListWithMetadataQuery : this.userListQuery;
            listQuery.fetch(queryVariables).subscribe(data => {
                    this.hasServerResponded = true;
                    this.displayWaitSpinner = false;
                    const directories = (data as any).data.list;
                    const directoryCount = directories.filter(fse => fse.__typename === 'Directory').length;
                    this.fileSystemElements = this.fileSystemElements.concat(directories
                        .filter(fse => fse.__typename === 'Directory' && fse.elements.length > 0
                            || fse.__typename === 'Image'
                            && (directoryCount > 0 && environment.mixDirectoriesAndImages || directoryCount === 0)
                        )
                        .map(fse => {
                            let fseName = fse.name;
                            let fseThumbnailUrl = environment.backEndLocation;
                            let id;
                            let takenAt = null;
                            if (fse.__typename === 'Directory') {
                                fseName = this.directoryService.removePrefixOrGet(fse.name);
                                if (fse.preview) {
                                    fseThumbnailUrl += fse.preview.thumbnailUrlPath;
                                } else {
                                    fseThumbnailUrl = null;
                                }
                                id = fse.id;
                            } else {
                                fseThumbnailUrl += fse.thumbnailUrlPath;
                                id = this.getPathAndFileNameSplitted(fse);
                                if (fse.metadata && fse.metadata.takenAt !== null) {
                                    takenAt = new Date(fse.metadata.takenAt).toLocaleString();
                                }
                            }

                            const fileSystemElement = {
                                id: this.replacePathSeparators(id),
                                name: fseName,
                                type: fse.__typename,
                                thumbnailUrl: fseThumbnailUrl,
                                thumbnailImageLoading: false,
                                thumbnailImageLoaded: false,
                                takenAt: takenAt
                            };

                            setTimeout(() => {
                                if (!fileSystemElement.thumbnailImageLoaded) {
                                    fileSystemElement.thumbnailImageLoading = true;
                                }
                            }, 200);

                            return fileSystemElement;
                        }));
                    document.body.style.overflow = 'scroll';
                }
            );
        }
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

    onPreviewImageLoaded(previewImageElement, fileSystemElement): void {
        fileSystemElement.previewImageLoading = false;
        fileSystemElement.previewImageLoaded = true;
        this.previewImageRatio = previewImageElement.naturalWidth / previewImageElement.naturalHeight;
        this.computePreviewImageClassName();
    }

    computePreviewImageClassName(): void {
        let classNameSuffix = 'height';
        if (this.previewImageRatio > this.galleryPreviewRatio) {
            classNameSuffix = 'width';
        }
        this.previewImageClassName = 'gallery-preview-full-' + classNameSuffix;
    }

    onThumbnailImageLoaded(fileSystemElement): void {
        fileSystemElement.thumbnailImageLoading = false;
        fileSystemElement.thumbnailImageLoaded = true;
    }

    openDeleteModal(imageFileSystemElement: any): void {
        this.ngbModal.open(DeleteModalComponent).result.then(() => {
            this.deleteImage(imageFileSystemElement);
        }, (reason) => {
            // Code/comment here to avoid in console: Error: Uncaught (in promise): no/close
        });
    }

    private notifyDeleteSuccess(): void {
        this.toastNotificationService.show(document.getElementById('gallery-preview-delete-success').textContent, {
            classname: 'bg-success text-light',
            delay: 4000
        });
    }

    navigateToNextFileSystemElement(): void {
        let path;
        if (this.previewImageIndex < this.previewImages.length - 1) {
            path = this.previewImages[this.previewImageIndex + 1].id;
        } else if (this.previewImageIndex > 0) {
            path = this.previewImages[this.previewImageIndex - 1].id;
        } else {
            path = this.fileSystemElementService.getParentId(this.previewImages[this.previewImageIndex]);
        }
        this.router.navigate(['/gallery/' + path]);
    }


    private notifyDeleteError(): void {
        this.toastNotificationService.show(document.getElementById('gallery-preview-delete-error').textContent, {
            classname: 'bg-danger text-light',
            delay: 5000
        });
    }

    deleteImage(imageFileSystemElement): void {
        const mutationVariables: any = {
            image: this.fileSystemElementService.getSlashedId(imageFileSystemElement)
        };
        this.deleteImageMutationService.mutate(mutationVariables).subscribe(() => {
                this.notifyDeleteSuccess();
                this.navigateToNextFileSystemElement();
            }, () => {
                this.notifyDeleteError();
            }
        );
    }
}
