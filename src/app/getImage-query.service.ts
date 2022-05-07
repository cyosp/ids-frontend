import {Injectable} from '@angular/core';
import {Query, gql} from 'apollo-angular';

@Injectable({
    providedIn: 'root'
})
export class GetImageQuery extends Query {
    document = gql`
        query getImage($directoryId: ID, $imageId: String!) { getImage(directory: $directoryId, image: $imageId) {
            id
            urlPath
            name
            previewUrlPath
        }
        }`;
}
