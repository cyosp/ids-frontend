import {Component, OnInit} from '@angular/core';
import {TokenStorageService} from '../token-storage.service';
import {AuthenticationService} from '../authentication.service';
import {ListQuery} from '../list-query.service';
import {environment} from '../../environments/environment';

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

    form: any = {};
    isAuthenticated = false;
    isLoginFailed = false;
    fileSystemElements: any[] = [];
    breakpoint: number;

    constructor(private tokenStorageService: TokenStorageService,
                private authenticationService: AuthenticationService,
                private userListQuery: ListQuery) {
    }

    ngOnInit(): void {
        this.breakpoint = (window.innerWidth / 200);
        this.isAuthenticated = this.tokenStorageService.hasTokenNonExpired();
        this.getPhotos();
    }

    onResize(event): any {
        this.breakpoint = (event.target.innerWidth / 200);
    }

    getPhotos(): void {
        this.userListQuery.fetch()
            .subscribe(data => {
                this.fileSystemElements = this.fileSystemElements.concat((data as any).data.list
                    .filter(fse => fse.__typename === 'Directory' && fse.elements.filter(this.isImage).length > 0
                        || fse.__typename === 'Image'
                    )
                    .map(fse => {
                        let fseThumbnailUrl = environment.backEndLocation;
                        if (fse.__typename === 'Directory') {
                            fseThumbnailUrl += fse.elements.filter(this.isImage)[0].thumbnailUrlPath;
                        } else {
                            fseThumbnailUrl += fse.thumbnailUrlPath;
                        }
                        return {
                            name: fse.name,
                            type: fse.__typename,
                            thumbnailUrl: fseThumbnailUrl
                        };
                    }));
            });
    }

    isImage(element, index, array): boolean
    {
        return element.__typename === 'Image';
    }
}
