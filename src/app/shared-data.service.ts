import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class SharedDataService {
    private mediaUrlPathSource = new BehaviorSubject(null);

    mediaUrlPath = this.mediaUrlPathSource.asObservable();

    constructor() {
    }

    setMediaUrlPath(mediaUrlPath: string): void {
        this.mediaUrlPathSource.next(mediaUrlPath);
    }
}
