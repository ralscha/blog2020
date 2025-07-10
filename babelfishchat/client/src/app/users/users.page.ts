import {Component, inject} from '@angular/core';
import {ChatService} from '../services/chat.service';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
  NavController
} from '@ionic/angular/standalone';
import {AsyncPipe} from '@angular/common';
import {addIcons} from "ionicons";
import {logOut} from "ionicons/icons";

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  imports: [AsyncPipe, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonList, IonItem, IonLabel]
})
export class UsersPage {
  readonly chatService = inject(ChatService);
  private readonly navCtrl = inject(NavController);

  constructor() {
    addIcons({logOut});
  }

  signout(): void {
    this.chatService.signout();
    this.navCtrl.navigateRoot('sign-in');
  }
}
