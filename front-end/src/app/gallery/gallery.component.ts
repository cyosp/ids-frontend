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
    photoUrls: string[] = [];
    directories: any[] = [];
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
                this.directories = this.directories.concat((data as any).data.list
                    .filter(filesystemelement => filesystemelement.__typename === 'Directory')
                    .map(p => {
                        return p.name;
                    }));
                this.photoUrls = this.photoUrls.concat((data as any).data.list
                    .filter(filesystemelement => filesystemelement.__typename === 'Image')
                    .map(p => {
                        return environment.backEndLocation + p.thumbnailUrlPath;
                    }));
            });
    }
}
