import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class UrlService {

    constructor(private router: Router) {
    }

    decodePath(): any {
        let directories = [];
        let imageName;
        if (this.router.url.startsWith('/gallery')) {
            let urlPath = decodeURI(this.router.url).replace(/\/gallery/, '');
            if (urlPath.startsWith('/')) {
                urlPath = urlPath.substring(1);
            }
            if (urlPath !== '') {
                let directoryId = '';
                const urlPathPipeSplitted = urlPath.split('|');
                const folders = urlPathPipeSplitted[0].split('>');
                for (let i = 0; i < folders.length; i++) {
                    const directoryName = folders[i];
                    directoryId += (i === 0 ? '/' : '>') + directoryName;
                    directories = directories.concat(
                        {
                            id: directoryId,
                            name: directoryName
                        }
                    );
                }
                imageName = urlPathPipeSplitted[1];
            }
        }

        return {
            directories,
            imageName
        };
    }
}
