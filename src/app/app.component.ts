import {Component, OnDestroy, OnInit} from '@angular/core';
import {TokenStorageService} from './token-storage.service';
import {Router} from '@angular/router';
import {SharedDataService} from './shared-data.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
    isAuthenticated = false;
    isGallery = false;
    directories: any[] = [];
    imageName: string;

    imageUrlPath: string;
    subscription: Subscription;

    constructor(private tokenStorageService: TokenStorageService,
                private router: Router,
                private sharedDataService: SharedDataService
                ) {
    }

    ngOnInit(): void {
        this.subscription = this.sharedDataService.imageUrlPath.subscribe(imageUrlPath => this.imageUrlPath = imageUrlPath);

        this.router.events.subscribe(
            val => {
                this.isAuthenticated = this.tokenStorageService.hasTokenNonExpired();
                this.isGallery = this.router.url.startsWith('/gallery');
                this.directories = [];
                this.imageName = null;
                if (this.isGallery) {
                    let urlPath = decodeURI(this.router.url).replace(/\/gallery/, '');
                    if (urlPath.startsWith('/')) {
                        urlPath = urlPath.substring(1);
                    }
                    if ( urlPath !== '')
                    {
                        let directoryId = '';
                        const urlPathPipeSplitted = urlPath.split('|');
                        const folders = urlPathPipeSplitted[0].split('>');
                        for (let i = 0; i < folders.length; i++) {
                            const directoryName = folders[i];
                            directoryId += (i === 0 ? '/' : '>') + directoryName;
                            this.directories = this.directories.concat(
                                {
                                    id: directoryId,
                                    name: directoryName
                                }
                            );
                        }
                        this.imageName = urlPathPipeSplitted[1];
                    }
                }
            }
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    logout(): void {
        this.tokenStorageService.signOut();
    }
}
