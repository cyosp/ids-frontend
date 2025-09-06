import {Injectable} from '@angular/core';
import {Query, gql} from 'apollo-angular';

@Injectable({
    providedIn: 'root'
})
export class GetMediaQuery extends Query {
    document = gql`
        query getMedia($mediaId: ID!) { getMedia(media: $mediaId) {
            metadata {
                takenAt
            }
        }
        }`;
}
