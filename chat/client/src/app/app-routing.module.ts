import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {TabsPage} from './tabs/tabs.page';
import {UsersPage} from './users/users.page';
import {MessagesPage} from './messages/messages.page';
import {SignInPage} from './sign-in/sign-in.page';
import {AuthGuard} from './services/auth-guard.service';

const routes: Routes = [
  {path: '', redirectTo: 'sign-in', pathMatch: 'full'},
  {path: 'sign-in', component: SignInPage},
  {
    path: 'chat',
    component: TabsPage,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'users',
        component: UsersPage
      },
      {
        path: 'messages',
        component: MessagesPage
      },
      {
        path: '',
        redirectTo: '/chat/users',
        pathMatch: 'full'
      }
    ]
  },
  {path: '**', redirectTo: 'chat'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules, useHash: true})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
