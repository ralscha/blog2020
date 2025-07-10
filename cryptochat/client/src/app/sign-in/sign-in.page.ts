import {Component, inject, OnInit} from '@angular/core';
import {
  AlertController,
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonTitle,
  IonToolbar,
  NavController
} from '@ionic/angular/standalone';
import {ChatService} from '../services/chat.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  imports: [FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonInput, IonButton]
})
export class SignInPage implements OnInit {
  username!: string;
  room!: string;
  private readonly navCtrl = inject(NavController);
  private readonly chatService = inject(ChatService);
  private readonly alertCtrl = inject(AlertController);

  ngOnInit(): void {
    this.chatService.init();
  }

  async enter(): Promise<void> {
    const ok = await this.chatService.signin(this.username, this.room);
    if (ok) {
      this.navCtrl.navigateRoot('messages');
    } else {
      this.showError();
    }
  }

  private async showError(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      message: 'Username already taken',
      buttons: [{
        text: 'OK',
        role: 'cancel'
      }]
    });
    await alert.present();
  }
}
