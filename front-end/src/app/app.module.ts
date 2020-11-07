import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {GalleryComponent} from './gallery/gallery.component';

import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {MatGridListModule} from '@angular/material/grid-list';
import {GraphQLModule} from './graphql.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    GalleryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatGridListModule,
    CommonModule,
    GraphQLModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {
}
