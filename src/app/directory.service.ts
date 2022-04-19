import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';

@Injectable()
export class DirectoryService {
    removePrefixOrGet(directoryName): string {
        return environment.removeDirectoryPrefix ===  undefined ?
            directoryName :
            directoryName.replace(new RegExp(environment.removeDirectoryPrefix), '');
    }
}
