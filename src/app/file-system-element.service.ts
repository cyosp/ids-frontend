import {Injectable} from '@angular/core';
import {Constants} from './constants';

@Injectable()
export class FileSystemElementService {

    getSlashedId(imageFileSystemElement: any): string {
        return imageFileSystemElement.id
            .replace(new RegExp('\\' + Constants.PIPE_CHARACTER + '(.*)'), Constants.SLASH_CHARACTER + '$1')
            .replace(new RegExp(Constants.GREATER_THAN_CHARACTER, 'g'), Constants.SLASH_CHARACTER);
    }

    getParentId(imageFileSystemElement: any): string {
        return imageFileSystemElement.id
            .replace(new RegExp('\\' + Constants.PIPE_CHARACTER + '(.*)'), '');
    }
}
