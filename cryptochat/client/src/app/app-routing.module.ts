import {inject} from '@angular/core';
import {Routes} from '@angular/router';
import {TabsPage} from './tabs/tabs.page';
import {UsersPage} from './users/users.page';
import {MessagesPage} from './messages/messages.page';
import {SignInPage} from './sign-in/sign-in.page';
import {AuthGuard} from './services/auth-guard.service';

export const routes: Routes = [
  {path: '', redirectTo: 'sign-in', pathMatch: 'full'},
  {path: 'sign-in', component: SignInPage},
  {
    path: 'chat',
    component: TabsPage,
    canActivate: [() => inject(AuthGuard).canActivate()],
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


