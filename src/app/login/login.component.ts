import {AfterViewInit, Component, OnInit} from '@angular/core';
import {UserService} from '../user.service';
import {AuthenticationService} from '../authentication.service';
import {ListQuery} from '../list-query.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
    passwordDisplayed = false;
    form: any = {};
    isAuthenticated = false;
    isLoginFailed = false;
    view;

    constructor(private userService: UserService,
                private authenticationService: AuthenticationService,
                private router: Router,
                private userListQuery: ListQuery,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.isAuthenticated = this.userService.hasTokenNonExpired();
        this.route.queryParams.subscribe(params => {
            if (params.view) {
                this.view = decodeURI(params.view);
            }
        });
    }

    private navigateToGallery(): void {
        this.router.navigate(['gallery']);
    }

    ngAfterViewInit(): void {
        if (this.isAuthenticated) {
            this.navigateToGallery();
        }
    }

    togglePasswordDisplayed(): void {
        this.passwordDisplayed = !this.passwordDisplayed;
    }

    onSubmit(): void {
        this.authenticationService.login(this.form).subscribe(
            dataRest => {
                this.userService.saveToken(dataRest.accessToken);
                this.userService.saveRole(dataRest.role);
                this.isAuthenticated = true;
                this.isLoginFailed = false;
                if (this.view) {
                    this.router.navigate([this.view]);
                } else {
                    this.navigateToGallery();
                }

                this.userListQuery.fetch()
                    .subscribe(({data}) => console.log(data));
            },
            () => {
                this.isLoginFailed = true;
            }
        );
    }

    reloadPage(): void {
        window.location.reload();
    }
}
