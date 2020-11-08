import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TokenStorageService} from './token-storage.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

    constructor(public tokenStorageService: TokenStorageService) {
    }

    intercept(httpRequest: HttpRequest<any>,
              httpHandler: HttpHandler): Observable<HttpEvent<any>> {

        const token = this.tokenStorageService.getToken();
        if (token) {
            httpRequest = httpRequest.clone({
                setHeaders: {
                    Authorization: `Bearer ` + token
                }
            });
            return httpHandler.handle(httpRequest);
        } else {
            return httpHandler.handle(httpRequest);
        }
    }
}
