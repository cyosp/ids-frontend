import {Component, OnInit} from '@angular/core';
import {TokenStorageService} from '../token-storage.service';
import {AuthenticationService} from '../authentication.service';
import {ListQuery} from '../list-query.service';

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
                this.photoUrls = this.photoUrls.concat((data as any).data.list
                    .filter(filesystemelement => filesystemelement.__typename === 'Image')
                    .map(p => {
                        return 'http://localhost:8080' + p.thumbnailUrlPath;
                    }));
            });
    }
}
