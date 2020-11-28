import {Component, OnInit} from '@angular/core';
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
export class GalleryComponent implements OnInit {
    readonly THUMBNAIL_SIZE = 200;

    isAuthenticated = false;
    isLoginFailed = false;
    fileSystemElements: any[] = [];
    breakpoint: number;

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
                this.updateFileSystemElements();
            }
        );
    }

    private updateFileSystemElements(): any {
        const path = decodeURI(this.router.url);
        let directoryId = null;
        if (path !== '/gallery') {
            directoryId = path.replace(/\/gallery\//, '');
        }
        if (directoryId) {
            directoryId = directoryId.replace(/>/g, '/');
        }
        this.getPhotos(directoryId);
    }

    onResize(event): any {
        this.breakpoint = (event.target.innerWidth / this.THUMBNAIL_SIZE);
    }

    getPhotos(directoryId: string): void {
        const queryVariables: any = {
            directoryReversedOrder: environment.directoryReversedOrder,
            previewDirectoryReversedOrder: environment.previewDirectoryReversedOrder,
        };
        if (directoryId) {
            queryVariables.directoryId = directoryId;
        }
        this.userListQuery.fetch(queryVariables)
            .subscribe(data => {
                const directoryCount = (data as any).data.list
                    .filter(fse => fse.__typename === 'Directory')
                    .length;
                this.fileSystemElements = this.fileSystemElements.concat((data as any).data.list
                    .filter(fse => fse.__typename === 'Directory' && fse.elements.length > 0
                        || fse.__typename === 'Image' && (directoryCount > 0 && environment.mixDirectoriesAndImages || directoryCount === 0)
                    )
                    .map(fse => {
                        let fseThumbnailUrl = environment.backEndLocation;
                        if (fse.__typename === 'Directory') {
                            if (fse.preview) {
                                fseThumbnailUrl += fse.preview.thumbnailUrlPath;
                            } else {
                                fseThumbnailUrl = null;
                            }
                        } else {
                            fseThumbnailUrl += fse.thumbnailUrlPath;
                        }
                        return {
                            id: fse.id.replace(/\//g, '>'),
                            name: fse.name,
                            type: fse.__typename,
                            thumbnailUrl: fseThumbnailUrl
                        };
                    }));
            });
    }
}
