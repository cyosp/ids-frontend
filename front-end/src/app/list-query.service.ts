import {Injectable} from '@angular/core';
import {Query, gql} from 'apollo-angular';

@Injectable({
    providedIn: 'root'
})
export class ListQuery extends Query {
    document = gql`
        query { list {
            id
            name
            __typename
            ... on Image {
                urlPath
                previewUrlPath
                thumbnailUrlPath
            }
        }
        }`;
}
