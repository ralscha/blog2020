import {Component, OnInit} from '@angular/core';
import {AlertController, NavController} from '@ionic/angular';
import {ChatService} from '../services/chat.service';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.page.html',
    styleUrls: ['./sign-in.page.scss'],
    standalone: false
})
export class SignInPage implements OnInit {

  username!: string;
  room!: string;

  constructor(private readonly navCtrl: NavController,
              private readonly chatService: ChatService,
              private readonly alertCtrl: AlertController) {
  }

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
