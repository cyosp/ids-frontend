import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Constants} from './constants';
import {DirectoryService} from './directory.service';

@Injectable({
    providedIn: 'root'
})

export class UrlService {
    private readonly queryParamsRegex = /\?.*/;

    constructor(private router: Router,
                private directoryService: DirectoryService) {
    }

    getUrl(): string {
        return decodeURI(this.router.url).replace(this.queryParamsRegex, '');
    }

    decodePath(): any {
        let directories = [];
        let mediaName;
        if (this.router.url.startsWith('/gallery')) {
            let urlPath = decodeURI(this.router.url).replace(/\/gallery/, '').replace(this.queryParamsRegex, '');
            if (urlPath.startsWith(Constants.SLASH_CHARACTER)) {
                urlPath = urlPath.substring(1);
            }
            if (urlPath !== '') {
                let directoryId = '';
                const urlPathPipeSplitted = urlPath.split(Constants.PIPE_CHARACTER);
                const folders = urlPathPipeSplitted[0].split(Constants.GREATER_THAN_CHARACTER);
                for (let i = 0; i < folders.length; i++) {
                    const directoryName = folders[i];
                    directoryId += (i === 0 ? Constants.SLASH_CHARACTER : Constants.GREATER_THAN_CHARACTER) + directoryName;
                    directories = directories.concat(
                        {
                            id: directoryId,
                            name: this.directoryService.removePrefixOrGet(directoryName)
                        }
                    );
                }
                mediaName = urlPathPipeSplitted[1];
            }
        }

        return {
            directories,
            mediaName
        };
    }
}
