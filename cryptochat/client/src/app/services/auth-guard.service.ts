import {Router, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {inject, Injectable} from '@angular/core';
import {ChatService} from './chat.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  private readonly chatService = inject(ChatService);
  private readonly router = inject(Router);


  canActivate():
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (!this.chatService.username) {
      return this.router.createUrlTree(['sign-in']);
    }

    return true;
  }

}
