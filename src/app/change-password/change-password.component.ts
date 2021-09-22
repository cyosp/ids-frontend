import {Component, OnInit} from '@angular/core';
import {UserService} from '../user.service';

import {ChangePasswordMutationService} from '../change-password-mutation.service';

@Component({
    selector: 'app-password-update',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
    isAuthenticated = false;
    passwordDisplayed = false;
    newPasswordDisplayed = false;
    form: any = {};
    passwordChanged = false;
    graphqlErrorExtensions;

    constructor(private userService: UserService,
                private changePasswordMutationService: ChangePasswordMutationService) {
    }

    ngOnInit(): void {
        this.isAuthenticated = this.userService.hasTokenNonExpired();
    }

    togglePasswordDisplayed(): void {
        this.passwordDisplayed = !this.passwordDisplayed;
    }

    toggleNewPasswordDisplayed(): void {
        this.newPasswordDisplayed = !this.newPasswordDisplayed;
    }

    submitForm(): void {
        const mutationVariables: any = {
            password: this.form.password,
            newPassword: this.form.newPassword
        };
        this.changePasswordMutationService.mutate(mutationVariables).subscribe(() => {
                this.passwordChanged = true;
                this.graphqlErrorExtensions = undefined;
            },
            errors => {
                this.passwordChanged = false;
                this.graphqlErrorExtensions = errors.graphQLErrors[0].extensions;
            }
        );
    }
}
