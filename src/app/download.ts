import {HttpEvent} from '@angular/common/http';
import {Observable} from 'rxjs';
import {distinctUntilChanged, scan} from 'rxjs/operators';
import {isHttpProgressEvent, isHttpResponse} from './http';

export interface Download {
    content: Blob | null;
    loaded: string;
    suffix: string;
    state: 'PENDING' | 'IN_PROGRESS' | 'DONE';
}

function getUnitIndex(bytes): number {
    return Math.floor(Math.log(bytes) / Math.log(1024));
}

function formatBytes(bytes): string {
    if (!+bytes) {
        return '0';
    }
    return `${(bytes / Math.pow(1024, getUnitIndex(bytes))).toFixed(1)}`;
}

function getUnitPrefix(bytes): string {
    if (!+bytes) {
        return '';
    }
    return `${['', 'K', 'M', 'G'][getUnitIndex(bytes)]}`;
}


export function download(
    saver?: (b: Blob) => void
): (source: Observable<HttpEvent<Blob>>) => Observable<Download> {
    return (source: Observable<HttpEvent<Blob>>) =>
        source.pipe(
            scan(
                (last: Download, event): Download => {
                    if (isHttpProgressEvent(event)) {
                        return {
                            loaded: formatBytes(event.loaded),
                            suffix: getUnitPrefix(event.loaded),
                            /*progress: event.total
                                ? Math.round((100 * event.loaded) / event.total)
                                : last.progress,*/
                            state: 'IN_PROGRESS',
                            content: null
                        };
                    }
                    if (isHttpResponse(event)) {
                        if (saver && event.body) {
                            saver(event.body);
                        }
                        return {
                            loaded: '',
                            suffix: '',
                            state: 'DONE',
                            content: event.body
                        };
                    }
                    return last;
                },
                {state: 'PENDING', loaded: '', content: null}
            ),
            distinctUntilChanged(
                (a, b) =>
                    a.state === b.state &&
                    a.loaded === b.loaded &&
                    a.suffix === b.suffix &&
                    a.content === b.content
            )
        );
}
