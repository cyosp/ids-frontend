import {Component, OnInit} from '@angular/core';
import {TokenStorageService} from './token-storage.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
    isAuthenticated = false;
    isGallery = false;
    directories: any[] = [];
    imageName: string;

    constructor(private tokenStorageService: TokenStorageService,
                private router: Router) {
    }

    ngOnInit(): void {

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

    logout(): void {
        this.tokenStorageService.signOut();
    }
}
