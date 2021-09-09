import {Injectable} from '@angular/core';
import {gql, Mutation} from 'apollo-angular';

@Injectable({
    providedIn: 'root'
})
export class ChangePasswordMutationService extends Mutation {
    document = gql`
        mutation changePassword($password: String!, $newPassword: String!) {
            changePassword(password: $password, newPassword: $newPassword) {
                id
            }
        }`;
}
