import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));

function matchBreadcrumbButton(target: any): boolean {
    return target.matches('#breadcrumb-button') || target.matches('#breadcrumb-button span');
}

function hideBreadcrumbContent(): void {
    const breadcrumbContent = document.getElementById('breadcrumb-content');
    if (breadcrumbContent) {
        breadcrumbContent.style.display = 'none';
    }
}

window.onclick = event => {
    if (!matchBreadcrumbButton(event.target)) {
        hideBreadcrumbContent();
    }
};
