import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from './user.service';
import {Router} from '@angular/router';
import {SharedDataService} from './shared-data.service';
import {Subscription} from 'rxjs';
import {Title} from '@angular/platform-browser';
import {environment} from '../environments/environment';
import {UrlService} from './url.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy {
    isAuthenticationNeeded = true;
    isAuthenticated = false;
    displayNavigationIcons = false;
    isGallery = false;
    directories: any[] = [];
    imageName: string;

    imageUrlPath: string;
    subscription: Subscription;

    constructor(private titleService: Title,
                private userService: UserService,
                private router: Router,
                private sharedDataService: SharedDataService,
                private urlService: UrlService
                ) {
    }

    ngOnInit(): void {
        this.titleService.setTitle(environment.sharingTitle);

        this.subscription = this.sharedDataService.imageUrlPath.subscribe(imageUrlPath => this.imageUrlPath = imageUrlPath);

        this.router.events.subscribe(
            val => {
                this.isAuthenticationNeeded = !environment.isPublicSharing;
                this.isAuthenticated = this.userService.hasTokenNonExpired();
                this.displayNavigationIcons = environment.isPublicSharing || this.isAuthenticated;
                this.isGallery = this.router.url.startsWith('/gallery');
                const decodedInfos = this.urlService.decodePath();
                this.directories = decodedInfos.directories;
                this.imageName = decodedInfos.imageName;
            }
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    logout(): void {
        this.userService.signOut();
    }

    toggleBreadcrumbContent(): void {
        const breadcrumbContentStyle = document.getElementById('breadcrumb-content').style;
        let breadcrumbContentDisplay = 'none';
        if (!breadcrumbContentStyle.display || breadcrumbContentStyle.display === breadcrumbContentDisplay) {
            breadcrumbContentStyle.minWidth = document.getElementById('breadcrumb-button').offsetWidth + 'px';
            breadcrumbContentDisplay = 'block';
        }
        breadcrumbContentStyle.display = breadcrumbContentDisplay;
    }

    hideBreadcrumbContent(): void {
        document.getElementById('breadcrumb-content').style.display = 'none';
    }

    toggleUserMenuContent(): void {
        const userMenuContentStyle = document.getElementById('user-menu-content').style;
        let userMenuContentDisplay = 'none';
        if (!userMenuContentStyle.display || userMenuContentStyle.display === userMenuContentDisplay) {
            userMenuContentDisplay = 'block';
        }
        userMenuContentStyle.display = userMenuContentDisplay;
    }
}
