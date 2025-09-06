import {Injectable} from '@angular/core';
import {gql, Mutation} from 'apollo-angular';

@Injectable({
    providedIn: 'root'
})
export class DeleteMediaMutationService extends Mutation {
    document = gql`
        mutation deleteMedia($media: ID!) {
            deleteMedia(media: $media) {
                id
            }
        }`;
}
