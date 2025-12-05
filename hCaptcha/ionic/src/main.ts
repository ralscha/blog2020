import {RouteReuseStrategy} from '@angular/router';
import {IonicRouteStrategy, provideIonicAngular} from '@ionic/angular/standalone';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {bootstrapApplication} from '@angular/platform-browser';
import {NgHcaptchaModule} from 'ng-hcaptcha';
import {environment} from './environments/environment';
import {AppComponent} from './app/app.component';
import {importProvidersFrom, provideZoneChangeDetection} from '@angular/core';


bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),provideIonicAngular(),
    importProvidersFrom(NgHcaptchaModule.forRoot({
      siteKey: environment.SITE_KEY
    })),
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    provideHttpClient(withInterceptorsFromDi())
  ]
})
  .catch(err => console.error(err));
