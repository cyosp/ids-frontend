import {APP_INITIALIZER, Injectable, NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {GalleryComponent} from './gallery/gallery.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {DeleteModalComponent} from './delete-modal/delete-modal.component';
import {ToastNotificationComponent} from './toast-notification/toast-notification.component';

import {BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig, HammerModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {MatGridListModule} from '@angular/material/grid-list';
import {GraphQLModule} from './graphql.module';
import {AuthInterceptorService} from './authInterceptor.service';
import {SecurePipe} from './SecurePipe';
import {SharedDataService} from './shared-data.service';
import {DownloadFileDirective} from './download-file.directive';
import {UrlService} from './url.service';
import {NgbToastModule} from '@ng-bootstrap/ng-bootstrap';
import {FileSystemElementService} from './file-system-element.service';
import {DirectoryService} from './directory.service';
import * as Hammer from 'hammerjs';
import {LazyLoadingComponent} from './lazy-loading/lazy-loading.component';
import {Apollo} from 'apollo-angular';
import {RouterModule} from '@angular/router';
import {VideoPlayerComponent} from './video-player/video-player.component';
import {SwCommunicationService} from './sw-communication.service';
import {ServiceWorkerModule} from '@angular/service-worker';

@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
    overrides = {
        swipe: {direction: Hammer.DIRECTION_ALL},
    } as any;
}

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        GalleryComponent,
        ChangePasswordComponent,
        DeleteModalComponent,
        ToastNotificationComponent,
        LazyLoadingComponent,
        SecurePipe,
        DownloadFileDirective,
        VideoPlayerComponent
    ],
    imports: [
        ServiceWorkerModule.register('sw.js', {enabled: true, registrationStrategy: 'registerImmediately'}),
        BrowserModule,
        FormsModule,
        MatGridListModule,
        CommonModule,
        GraphQLModule,
        HammerModule,
        NgbToastModule,
        RouterModule.forRoot([{
            path: 'login', component: LoginComponent,
        }, {
            path: 'change-password', component: ChangePasswordComponent,
        }, {
            path: 'gallery',
            component: GalleryComponent,
            children: [{
                path: ':directoryId',
                component: GalleryComponent
            }]
        }
        ])
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: (swCommunicationService: SwCommunicationService) => {
                return () => {
                    return swCommunicationService;
                };
            },
            multi: true,
            deps: [SwCommunicationService],
        },
        Apollo,
        provideHttpClient(
            withInterceptorsFromDi()
        ),
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptorService,
            multi: true
        }, {
            provide: HAMMER_GESTURE_CONFIG,
            useClass: MyHammerConfig
        }, SharedDataService,
        UrlService,
        FileSystemElementService,
        DirectoryService
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
