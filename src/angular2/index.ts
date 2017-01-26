import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { NamesModule } from './names.module';

declare var __PRODUCTION__: boolean;

if (__PRODUCTION__) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(NamesModule);