import {Component} from '@angular/core';

import {ToastNotificationService} from '../toast-notification.service';

@Component({
    selector: 'app-toast-notification',
    templateUrl: 'toast-notification.component.html',
    host: {'[class.ngb-toasts]': 'true'}
})
export class ToastNotificationComponent {
    constructor(public toastNotificationService: ToastNotificationService) {
    }
}
