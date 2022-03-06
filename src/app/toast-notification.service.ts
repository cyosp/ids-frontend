import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class ToastNotificationService {
    toast: any;

    show(text: string, options: any = {}): void {
        this.toast = {text, ...options};
    }

    remove(): void {
        this.toast = null;
    }
}
