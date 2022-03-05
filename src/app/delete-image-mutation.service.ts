import {Injectable} from '@angular/core';
import {gql, Mutation} from 'apollo-angular';

@Injectable({
    providedIn: 'root'
})
export class DeleteImageMutationService extends Mutation {
    document = gql`
        mutation deleteImage($image: ID!) {
            deleteImage(image: $image) {
                id
            }
        }`;
}
