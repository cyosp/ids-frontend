import {HttpEvent, HttpEventType, HttpProgressEvent, HttpResponse} from '@angular/common/http';

export function isHttpResponse<T>(event: HttpEvent<T>): event is HttpResponse<T> {
    return event.type === HttpEventType.Response;
}

export function isHttpProgressEvent(event: HttpEvent<unknown>): event is HttpProgressEvent {
    return (
        event.type === HttpEventType.DownloadProgress ||
        event.type === HttpEventType.UploadProgress
    );
}
