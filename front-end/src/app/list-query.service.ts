import {Injectable} from '@angular/core';
import {Query, gql} from 'apollo-angular';

@Injectable({
    providedIn: 'root'
})
export class ListQuery extends Query {
    document = gql`
        query { list {
            name
            __typename
            ... on Directory {
                elements {
                    __typename
                    ... on Image {
                        thumbnailUrlPath
                    }
                }
            }
            ... on Image {
                thumbnailUrlPath
            }
        }
        }`;
}
