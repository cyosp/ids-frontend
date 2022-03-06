import {Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Constants} from './constants';

@Directive({
    selector: '[downloadFile]'
})
export class DownloadFileDirective {
    constructor(private readonly httpClient: HttpClient,
                private readonly renderer2: Renderer2,
                private elementRef: ElementRef) {
    }

    private downloadUrl: string;

    @Input('downloadFile')
    public set url(downloadUrl: string) {
        this.downloadUrl = downloadUrl;
    }

    @HostListener('click')
    public async onClick(): Promise<void> {
        const waitSpinner = this.elementRef.nativeElement.querySelector('img');

        let newHyperlinkClicked = false;
        let timerStarted = false;
        setTimeout(() => {
            if (!newHyperlinkClicked) {
                timerStarted = true;
                this.renderer2.setStyle(waitSpinner, 'display', 'inline');
            }
        }, 200);

        const response = await this.httpClient.get(
            this.downloadUrl,
            {responseType: 'blob', observe: 'response'}
        ).toPromise();
        const blobUrl = URL.createObjectURL(response.body);

        const newHyperlink = document.createElement('a');
        newHyperlink.href = blobUrl;
        newHyperlink.download = this.getFileName();
        newHyperlink.click();
        newHyperlinkClicked = true;

        if (timerStarted) {
            this.renderer2.setStyle(waitSpinner, 'display', 'none');
        }
        URL.revokeObjectURL(blobUrl);
    }

    private getFileName(): string {
        return this.downloadUrl.substr(this.downloadUrl.lastIndexOf(Constants.SLASH_CHARACTER), this.downloadUrl.length);
    }
}
