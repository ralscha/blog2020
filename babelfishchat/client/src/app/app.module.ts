import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {RouteReuseStrategy} from '@angular/router';
import {TabsPage} from './tabs/tabs.page';
import {UsersPage} from './users/users.page';
import {MessagesPage} from './messages/messages.page';
import {FormsModule} from '@angular/forms';
import {SignInPage} from './sign-in/sign-in.page';
import {RelativeTimePipe} from './pipes/relative-time.pipe';

@NgModule({
  declarations: [
    AppComponent,
    SignInPage,
    UsersPage,
    MessagesPage,
    TabsPage,
    RelativeTimePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    IonicModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
