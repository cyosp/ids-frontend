import {Injectable} from '@angular/core';
import {Query, gql} from 'apollo-angular';

@Injectable({
    providedIn: 'root'
})
export class GetMediasQuery extends Query {
    document = gql`
        query getMedias($directoryId: ID, $mediaId: String!) { getMedias(directory: $directoryId, media: $mediaId) {
            id
            urlPath
            name
            previewUrlPath
        }
        }`;
}
