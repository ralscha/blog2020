import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {RouteReuseStrategy} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {environment} from '../environments/environment';
import {NgHcaptchaModule} from 'ng-hcaptcha';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NgHcaptchaModule.forRoot({
      siteKey: environment.SITE_KEY
    }),
    IonicModule.forRoot()
  ],
  providers: [
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
