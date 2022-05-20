import {Injectable} from '@angular/core';
import {Query, gql} from 'apollo-angular';

@Injectable({
    providedIn: 'root'
})
export class GetImageQuery extends Query {
    document = gql`
        query getImage($imageId: ID!) { getImage(image: $imageId) {
            metadata {
                takenAt
            }
        }
        }`;
}
