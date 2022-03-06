import {Injectable, NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {GalleryComponent} from './gallery/gallery.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {DeleteModalComponent} from './delete-modal/delete-modal.component';
import {ToastNotificationComponent} from './toast-notification/toast-notification.component';

import {BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig, HammerModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {FormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
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

import * as Hammer from 'hammerjs';

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
        SecurePipe,
        DownloadFileDirective
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        MatGridListModule,
        CommonModule,
        GraphQLModule,
        HammerModule,
        NgbToastModule
    ],
    providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptorService,
        multi: true
    }, {
        provide: HAMMER_GESTURE_CONFIG,
        useClass: MyHammerConfig
    }, SharedDataService,
        UrlService,
        FileSystemElementService
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
