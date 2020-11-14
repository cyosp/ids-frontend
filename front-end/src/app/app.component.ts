import {Component, OnInit} from '@angular/core';
import {TokenStorageService} from './token-storage.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
    title = 'Ids';
    isAuthenticated = false;
    directories: any[] = [];

    constructor(private tokenStorageService: TokenStorageService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.isAuthenticated = this.tokenStorageService.hasTokenNonExpired();

        this.router.events.subscribe(
            val => {
                this.directories = [];

                let urlPath = decodeURI(this.router.url).replace(/\/gallery/, '');
                if (urlPath.startsWith('/')) {
                    urlPath = urlPath.substring(1);
                }
                if ( urlPath !== '')
                {
                    let directoryId = '';
                    const folders = urlPath.split('>');
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
                }
            }
        );
    }

    logout(): void {
        this.tokenStorageService.signOut();
    }
}
