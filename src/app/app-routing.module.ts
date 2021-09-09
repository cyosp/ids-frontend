import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {LoginComponent} from './login/login.component';
import {GalleryComponent} from './gallery/gallery.component';
import {ChangePasswordComponent} from './change-password/change-password.component';

const routes: Routes = [
  {
    path: 'login', component: LoginComponent,
  },
  {
    path: 'change-password', component: ChangePasswordComponent,
  },
  {
    path: 'gallery',
    component: GalleryComponent,
    children: [
      {
        path: ':directoryId',
        component: GalleryComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
