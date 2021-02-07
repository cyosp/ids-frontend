import {Injectable} from '@angular/core';
import {Query, gql} from 'apollo-angular';

@Injectable({
    providedIn: 'root'
})
export class ListQuery extends Query {
    document = gql`
        query list($directoryId: ID, $directoryReversedOrder: Boolean, $previewDirectoryReversedOrder: Boolean) { list(directory: $directoryId, directoryReversedOrder: $directoryReversedOrder, previewDirectoryReversedOrder: $previewDirectoryReversedOrder) {
            id
            name
            __typename
            ... on Directory {
                preview {
                    thumbnailUrlPath
                }
                elements {
                    __typename
                }
            }
            ... on Image {
                thumbnailUrlPath,
                previewUrlPath
            }
        }
        }`;
}
