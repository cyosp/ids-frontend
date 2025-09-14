import {
    AfterViewChecked,
    AfterViewInit,
    Component,
    ElementRef,
    HostListener,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import {UserService} from '../user.service';
import {ListQuery} from '../list-query.service';
import {ListQueryWithMetadata} from '../list-with-metadata-query.service';
import {GetMediasQuery} from '../getMedias-query.service';
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
import {DeleteMediaMutationService} from '../delete-media-mutation.service';
import {ToastNotificationService} from '../toast-notification.service';
import {DirectoryService} from '../directory.service';
import {ViewportScroller} from '@angular/common';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss']
})

export class GalleryComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
    readonly THUMBNAIL_SIZE = Constants.THUMBNAIL_SIZE;

    readonly LEFT_DIRECTION = 'Left';
    readonly RIGHT_DIRECTION = 'Right';

    readonly MIME_CODEC = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';

    @ViewChild('videoElement') videoElement: ElementRef;

    isAuthenticated = false;
    isAdministrator = false;
    displayWaitSpinner = false;
    hasServerResponded = false;
    fileSystemElements: any[] = [];
    previewMediaIndex: any;
    previewMedias: any[] = [];
    previewMediaRatio: number;
    previewMediaClassName: string;
    addTakenDateOnThumbnails: boolean;
    breakpoint: number;
    galleryPreviewWidth: number;
    galleryPreviewHeight: number;
    galleryPreviewRatio: number;
    navbarHeight: number;
    mediaUrlPath: string;
    subscription: Subscription;
    jumpTo: string;
    jumpToTryCount = 0;
    hasJumpedTo = false;
    previousUrl = '';
    isVideoVisible = false;

    constructor(private userService: UserService,
                private http: HttpClient,
                private userListQuery: ListQuery,
                private userListWithMetadataQuery: ListQueryWithMetadata,
                private getMediasQuery: GetMediasQuery,
                public router: Router,
                private route: ActivatedRoute,
                private sharedDataService: SharedDataService,
                private urlService: UrlService,
                private fileSystemElementService: FileSystemElementService,
                private ngbModal: NgbModal,
                private deleteMediaMutationService: DeleteMediaMutationService,
                private toastNotificationService: ToastNotificationService,
                private directoryService: DirectoryService,
                private viewportScroller: ViewportScroller) {
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
                this.openDeleteModal(this.previewMedias[this.previewMediaIndex]);
                break;
        }
    }

    private changePreview(direction: string): any {
        if (this.previewMedias.length !== 0) {
            const NO_NEW_INDEX = -1;
            let newIndex = NO_NEW_INDEX;
            switch (direction) {
                case this.LEFT_DIRECTION:
                    if (this.previewMediaIndex > 0) {
                        newIndex = this.previewMediaIndex - 1;
                    }
                    break;
                case this.RIGHT_DIRECTION:
                    if (this.previewMediaIndex < this.previewMedias.length - 1) {
                        newIndex = this.previewMediaIndex + 1;
                    }
                    break;
            }
            if (newIndex !== NO_NEW_INDEX) {
                this.router.navigate(['/gallery/' + this.previewMedias[newIndex].id]);
            }
        }
    }

    private previewLevelUp(): any {
        const decodedInfos = this.urlService.decodePath();
        const directories = decodedInfos.directories;
        const mediaName = decodedInfos.mediaName;

        let directoryCommand = '';
        let jumpTo;
        const currentDirectoryIndex = directories.length - 1;
        if (mediaName) {
            directoryCommand = directories[currentDirectoryIndex].id;
            jumpTo = mediaName;
        } else {
            const parentDirectoryIndex = currentDirectoryIndex - 1;
            if (parentDirectoryIndex >= 0) {
                directoryCommand = directories[parentDirectoryIndex].id;
            }
            if (currentDirectoryIndex >= 0) {
                jumpTo = directories[currentDirectoryIndex].name;
            }
        }

        this.router.navigate(['/gallery' + directoryCommand], {queryParams: {jmp: jumpTo}});
    }

    ngOnInit(): void {
        this.subscription = this.sharedDataService.mediaUrlPath.subscribe(mediaUrlPath => this.mediaUrlPath = mediaUrlPath);

        this.breakpoint = (window.innerWidth / this.THUMBNAIL_SIZE);
        this.isAuthenticated = this.userService.hasTokenNonExpired();
        this.isAdministrator = this.userService.isAdministrator();

        this.router.events.subscribe(
            val => {
                const url = this.urlService.getUrl();
                if (this.previousUrl !== url) {
                    this.previousUrl = url;
                    this.fileSystemElements = [];
                    this.previewMediaIndex = null;
                    this.previewMedias = [];
                    this.updateFileSystemElements();
                }
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
        this.viewportScroller.setOffset([0, this.navbarHeight]);
        this.computeGalleryPreviewDimensions();
    }

    ngAfterContentChecked(): void {
        if (this.isVideoVisible === false && this.videoElement != null) {
            this.isVideoVisible = true;
            this.loadVideo();
        } else if (this.isVideoVisible === true && this.videoElement == null) {
            this.isVideoVisible = false;
        }
    }

    public loadVideo(): void {
        if ('MediaSource' in window && MediaSource.isTypeSupported(this.MIME_CODEC)) {
            const mediaSource = new MediaSource();
            (this.videoElement.nativeElement as HTMLVideoElement).src = URL.createObjectURL(mediaSource);
            mediaSource.addEventListener('sourceopen', () => this.loadVideoMediaSource(mediaSource));
        } else {
            console.error('Unsupported MIME type or codec: ', this.MIME_CODEC);
        }
    }

    loadVideoMediaSource(mediaSource: MediaSource): void {
        const sourceBuffer = mediaSource.addSourceBuffer(this.MIME_CODEC);
        const token = this.userService.getToken();
        const headers = new HttpHeaders({Authorization: `Bearer ${token}`});
        this.http
            .get(this.previewMedias[this.previewMediaIndex].previewUrlPath, {headers, responseType: 'blob'})
            .subscribe(blob => {
                sourceBuffer.addEventListener('updateend', () => {
                    mediaSource.endOfStream();
                    (this.videoElement.nativeElement as HTMLVideoElement).play();
                });
                blob.arrayBuffer().then(x => {
                    sourceBuffer.appendBuffer(x);
                });
            });
    }

    ngAfterViewChecked(): void {
        if (this.jumpTo && !this.hasJumpedTo && this.jumpToTryCount < 3) {
            const jumpToId = this.jumpTo;
            this.hasJumpedTo = document.getElementById(jumpToId) !== null;
            this.jumpToTryCount++;
            this.viewportScroller.scrollToAnchor(jumpToId);
        }
    }

    private updateFileSystemElements(): any {
        this.route.queryParams.subscribe(queryParams => {
                this.hasJumpedTo = false;
                this.jumpToTryCount = 0;
                this.jumpTo = queryParams.jmp;
            }
        );
        const url = this.urlService.getUrl();
        let directoryId = null;
        let mediaName = null;
        if (url !== '/gallery') {
            directoryId = url.replace(/\/gallery\//, '');
        }
        if (directoryId) {
            directoryId = directoryId.replace(/>/g, Constants.SLASH_CHARACTER);
        }
        if (directoryId) {
            const directoryIdPipeSplitted = directoryId.split(Constants.PIPE_CHARACTER);
            directoryId = directoryIdPipeSplitted[0];
            mediaName = directoryIdPipeSplitted[1];
        }
        this.getPhotos(directoryId, mediaName);
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

    getPhotos(directoryId: string, mediaName: string): void {
        this.displayWaitSpinner = false;
        this.hasServerResponded = false;
        setTimeout(() => {
            if (!this.hasServerResponded) {
                this.displayWaitSpinner = true;
            }
        }, 200);

        if (mediaName) {
            this.getMediasQuery.fetch({
                directoryId,
                mediaId: mediaName
            }).subscribe(data => {
                this.hasServerResponded = true;
                this.displayWaitSpinner = false;

                const medias = (data as any).data.getMedias;
                this.previewMediaIndex = medias[0] == null ? 0 : 1;
                this.sharedDataService.setMediaUrlPath(environment.backEndLocation + medias[1].urlPath);

                this.previewMedias = this.previewMedias.concat(medias
                    .filter(media => media != null)
                    .map(media => {
                        const fileSystemElement = {
                            id: this.replacePathSeparators(this.getPathAndFileNameSplitted(media)),
                            name: media.name,
                            type: media.__typename,
                            previewUrlPath: environment.backEndLocation + media.previewUrlPath,
                            previewMediaLoading: false,
                            previewMediaLoaded: false
                        };

                        setTimeout(() => {
                            if (!fileSystemElement.previewMediaLoaded) {
                                fileSystemElement.previewMediaLoading = true;
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
                            || fse.__typename === 'Video'
                            && (directoryCount > 0 && environment.mixDirectoriesAndMedias || directoryCount === 0)
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
                                thumbnailMediaLoading: false,
                                thumbnailMediaLoaded: false,
                                takenAt: takenAt
                            };

                            setTimeout(() => {
                                if (!fileSystemElement.thumbnailMediaLoaded) {
                                    fileSystemElement.thumbnailMediaLoading = true;
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
        this.computePreviewMediaClassName();
    }

    onSwipeLeft(): void {
        this.changePreview(this.RIGHT_DIRECTION);
    }

    onSwipeRight(): void {
        this.changePreview(this.LEFT_DIRECTION);
    }

    onPreviewMediaLoaded(previewMediaElement, fileSystemElement): void {
        fileSystemElement.previewMediaLoading = false;
        fileSystemElement.previewMediaLoaded = true;
        if (fileSystemElement.type === 'Image') {
            this.previewMediaRatio = previewMediaElement.naturalWidth / previewMediaElement.naturalHeight;
        } else if (fileSystemElement.type === 'Video') {
            this.previewMediaRatio = previewMediaElement.videoWidth / previewMediaElement.videoHeight;
        }
        this.computePreviewMediaClassName();
    }

    computePreviewMediaClassName(): void {
        let classNameSuffix = 'height';
        if (this.previewMediaRatio > this.galleryPreviewRatio) {
            classNameSuffix = 'width';
        }
        this.previewMediaClassName = 'gallery-preview-full-' + classNameSuffix;
    }

    onThumbnailMediaLoaded(fileSystemElement): void {
        fileSystemElement.thumbnailMediaLoading = false;
        fileSystemElement.thumbnailMediaLoaded = true;
    }

    openDeleteModal(mediaFileSystemElement: any): void {
        this.ngbModal.open(DeleteModalComponent).result.then(() => {
            this.deleteMedia(mediaFileSystemElement);
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
        if (this.previewMediaIndex < this.previewMedias.length - 1) {
            path = this.previewMedias[this.previewMediaIndex + 1].id;
        } else if (this.previewMediaIndex > 0) {
            path = this.previewMedias[this.previewMediaIndex - 1].id;
        } else {
            path = this.fileSystemElementService.getParentId(this.previewMedias[this.previewMediaIndex]);
        }
        this.router.navigate(['/gallery/' + path]);
    }


    private notifyDeleteError(): void {
        this.toastNotificationService.show(document.getElementById('gallery-preview-delete-error').textContent, {
            classname: 'bg-danger text-light',
            delay: 5000
        });
    }

    deleteMedia(mediaFileSystemElement): void {
        const mutationVariables: any = {
            media: this.fileSystemElementService.getSlashedId(mediaFileSystemElement)
        };
        this.deleteMediaMutationService.mutate(mutationVariables).subscribe(() => {
                this.notifyDeleteSuccess();
                this.navigateToNextFileSystemElement();
            }, () => {
                this.notifyDeleteError();
            }
        );
    }
}
