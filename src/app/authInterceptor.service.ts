import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserService} from './user.service';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

    constructor(public userService: UserService,
                private router: Router) {
    }

    intercept(httpRequest: HttpRequest<any>,
              httpHandler: HttpHandler): Observable<HttpEvent<any>> {

        const token = this.userService.getToken();
        if (token) {
            httpRequest = httpRequest.clone({
                setHeaders: {
                    Authorization: `Bearer ` + token
                }
            });
        }

        return httpHandler.handle(httpRequest).pipe(tap(() => {
            },
            (error: any) => {
                const LOGIN_PATH = 'login';
                if (error instanceof HttpErrorResponse && error.status === 401 && !this.router.url.startsWith('/' + LOGIN_PATH)) {
                    this.router.navigate([LOGIN_PATH], {queryParams: {view: this.router.url}});
                }
            }));
    }
}
