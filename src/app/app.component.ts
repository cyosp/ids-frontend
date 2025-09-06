import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {UserService} from './user.service';
import {Router} from '@angular/router';
import {SharedDataService} from './shared-data.service';
import {Subscription} from 'rxjs';
import {Title} from '@angular/platform-browser';
import {environment} from '../environments/environment';
import {UrlService} from './url.service';
import {Constants} from './constants';
import {FileSystemElementService} from './file-system-element.service';
import {GetMediaQuery} from './getMedia-query.service';

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
    displayImageInfoWaitSpinner = false;
    hasServerImageInfoResponded = false;
    imageTakenAt: string;

    imageUrlPath: string;
    subscription: Subscription;

    constructor(private titleService: Title,
                private userService: UserService,
                private router: Router,
                private sharedDataService: SharedDataService,
                private urlService: UrlService,
                private fileSystemElementService: FileSystemElementService,
                private getMediaQuery: GetMediaQuery) {
    }

    @HostListener('window:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): any {
        switch (event.key) {
            case 'i':
                this.toggleInfoContent();
                break;
        }
    }

    ngOnInit(): void {
        this.titleService.setTitle(environment.sharingTitle);

        this.subscription = this.sharedDataService.mediaUrlPath.subscribe(imageUrlPath => this.imageUrlPath = imageUrlPath);

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

    toggleInfoContent(): void {
        const infoContent = document.getElementById('info-content');
        if (infoContent) {
            const infoContentStyle = infoContent.style;
            const infoContentDisplay = 'none';
            if (!infoContentStyle.display || infoContentStyle.display === infoContentDisplay) {
                this.displayImageInfoWaitSpinner = false;
                this.hasServerImageInfoResponded = false;
                setTimeout(() => {
                    if (!this.hasServerImageInfoResponded) {
                        this.displayImageInfoWaitSpinner = true;
                    }
                }, 200);
                const fileSystemElement = this.directories[this.directories.length - 1];
                const mediaId = this.fileSystemElementService.getSlashedId(fileSystemElement)
                    + Constants.SLASH_CHARACTER + this.imageName;
                this.getMediaQuery.fetch({
                    mediaId
                }).subscribe(data => {
                    const takenAt = (data as any).data.getMedia.metadata.takenAt;
                    this.imageTakenAt = (takenAt !== null ? new Date(takenAt).toLocaleString() : null);
                    this.hasServerImageInfoResponded = true;
                    this.displayImageInfoWaitSpinner = false;
                    infoContentStyle.display = 'block';
                });
            }
            infoContentStyle.display = infoContentDisplay;
        }
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

    getDirectoryDownloadUrl(directoryId: string): string {
        return environment.backEndLocation + '/download' + directoryId.replace(/>/g, '/') + '.zip';
    }
}
