import {Component, ContentChild, ElementRef, EventEmitter, OnDestroy, OnInit, Output, TemplateRef} from '@angular/core';

import {Constants} from '../constants';

@Component({
    selector: 'app-lazy-loading',
    template: `
        <ng-container *ngIf="inView" [ngTemplateOutlet]="template">
        </ng-container>
    `,
    styles: [':host {display: block;}']
})
export class LazyLoadingComponent implements OnInit, OnDestroy {
    intersectionObserver: IntersectionObserver;
    inView = false;

    @ContentChild(TemplateRef) template: TemplateRef<any>;
    @Output('inView') inView$: EventEmitter<any> = new EventEmitter();
    @Output('notInView') notInView$: EventEmitter<any> = new EventEmitter();

    constructor(public elementRef: ElementRef) {
    }

    ngOnInit(): void {
        this.intersectionObserver = new IntersectionObserver(this.handleIntersect.bind(this),
            {rootMargin: `0px 0px ${Constants.THUMBNAIL_SIZE}px 0px`});
        this.intersectionObserver.observe(this.elementRef.nativeElement);
    }

    ngOnDestroy(): void {
        this.intersectionObserver.disconnect();
    }

    handleIntersect(entries): void {
        entries.forEach((entry: IntersectionObserverEntry) => {
            if (entry.isIntersecting) {
                this.inView = true;
                this.inView$.emit(entry);
            } else {
                this.notInView$.emit(entry);
            }
        });
    }
}
