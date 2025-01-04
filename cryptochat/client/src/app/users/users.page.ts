import {Component} from '@angular/core';
import {ChatService} from '../services/chat.service';
import {NavController} from '@ionic/angular';

@Component({
    selector: 'app-users',
    templateUrl: './users.page.html',
    styleUrls: ['./users.page.scss'],
    standalone: false
})
export class UsersPage {

  constructor(public readonly chatService: ChatService,
              private readonly navCtrl: NavController) {
  }

  signout(): void {
    this.chatService.signout();
    this.navCtrl.navigateRoot('sign-in');
  }
}
