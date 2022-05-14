import {Injectable} from '@angular/core';
import {Query, gql} from 'apollo-angular';

@Injectable({
    providedIn: 'root'
})
export class GetImagesQuery extends Query {
    document = gql`
        query getImages($directoryId: ID, $imageId: String!) { getImages(directory: $directoryId, image: $imageId) {
            id
            urlPath
            name
            previewUrlPath
        }
        }`;
}
