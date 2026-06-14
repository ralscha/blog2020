import { provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [provideZoneChangeDetection(), provideHttpClient(withXhr(), withInterceptorsFromDi())],
}).catch((err) => console.error(err));
