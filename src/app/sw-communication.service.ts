import {Injectable} from '@angular/core';
import {UserService} from './user.service';

@Injectable({
    providedIn: 'root',
})
export class SwCommunicationService {
    constructor(public userService: UserService) {
        const sw = navigator.serviceWorker;
        if (sw) {
            sw.addEventListener('message', async (event) => {
                if (event.data === 'requestToken') {
                    event.ports[0].postMessage(this.userService.getToken());
                }
            });
        }
    }
}
