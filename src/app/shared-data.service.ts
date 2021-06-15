import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class SharedDataService {
    private imageUrlPathSource = new BehaviorSubject(null);

    imageUrlPath = this.imageUrlPathSource.asObservable();

    constructor() {
    }

    setImageUrlPath(imageUrlPath: string): void {
        this.imageUrlPathSource.next(imageUrlPath);
    }
}
