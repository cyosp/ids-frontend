import {AfterViewInit, Component, OnInit} from '@angular/core';
import {UserService} from '../user.service';
import {AuthenticationService} from '../authentication.service';
import {Router} from '@angular/router';
import {Constants} from '../constants';

@Component({
    selector: 'app-login',
    templateUrl: './shared-link.component.html',
    styleUrls: ['./shared-link.component.scss']
})
export class SharedLinkComponent implements OnInit {
    constructor(private userService: UserService,
                private authenticationService: AuthenticationService,
                private router: Router) {
    }

     displayWaitSpinner = false;

    ngOnInit(): void {
        setTimeout(() => {
                this.displayWaitSpinner = true;
        }, 200);

        const key = decodeURI(this.router.url).replace(/\/shared-link\//, '') + '@guest.local';
        this.authenticationService.login({
            email: key,
            password: key
        }).subscribe(
            dataRest => {
                this.userService.saveToken(dataRest.accessToken);
                this.userService.saveRole(dataRest.role);
                this.userService.saveHome(dataRest.home);
                const path = dataRest.home.replace(new RegExp(Constants.SLASH_CHARACTER, 'g'), Constants.GREATER_THAN_CHARACTER);
                this.router.navigate(['gallery/' + path]);
            }, () => {
            }
        );
    }
}
