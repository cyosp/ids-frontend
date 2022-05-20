import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));

function matchInfoButton(target: any): boolean {
    return target.matches('#info-button') || target.matches('#info-button span');
}

function hideInfoContent(): void {
    const breadcrumbContent = document.getElementById('info-content');
    if (breadcrumbContent) {
        breadcrumbContent.style.display = 'none';
    }
}

function matchBreadcrumbButton(target: any): boolean {
    return target.matches('#breadcrumb-button') || target.matches('#breadcrumb-button span');
}

function hideBreadcrumbContent(): void {
    const breadcrumbContent = document.getElementById('breadcrumb-content');
    if (breadcrumbContent) {
        breadcrumbContent.style.display = 'none';
    }
}

function matchUserMenuButton(target: any): boolean {
    return target.matches('#user-menu-button') || target.matches('#user-menu-button span');
}

function hideUserMenuContent(): void {
    const userMenuContent = document.getElementById('user-menu-content');
    if (userMenuContent) {
        userMenuContent.style.display = 'none';
    }
}

window.onclick = event => {
    if (!matchInfoButton(event.target)) {
        hideInfoContent();
    }
    if (!matchBreadcrumbButton(event.target)) {
        hideBreadcrumbContent();
    }
    if (!matchUserMenuButton(event.target)) {
        hideUserMenuContent();
    }
};
