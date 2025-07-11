import {Component, ElementRef, inject, OnInit, viewChild} from '@angular/core';
import {ChatService} from '../services/chat.service';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonTextarea,
  IonTitle,
  IonToolbar,
  NavController
} from '@ionic/angular/standalone';
import {FormsModule} from '@angular/forms';
import {AsyncPipe} from '@angular/common';
import {RelativeTimePipe} from '../pipes/relative-time.pipe';
import {addIcons} from "ionicons";
import {logOut, send} from "ionicons/icons";

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrl: './messages.page.scss',
  imports: [FormsModule, AsyncPipe, RelativeTimePipe, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonList, IonItem, IonLabel, IonFooter, IonTextarea]
})
export class MessagesPage implements OnInit {
  readonly chatService = inject(ChatService);
  messageText: string | null = null;
  readonly content = viewChild.required(IonContent);
  private readonly navCtrl = inject(NavController);
  private readonly chatElement = viewChild.required(IonList, { read: ElementRef });
  private mutationObserver!: MutationObserver;

  constructor() {
    addIcons({logOut, send});
  }

  ngOnInit(): void {
    this.mutationObserver = new MutationObserver(() => {
      setTimeout(() => {
        this.content().scrollToBottom();
      }, 100);
    });
    this.mutationObserver.observe(this.chatElement().nativeElement, {
      childList: true
    });
  }

  signout(): void {
    this.chatService.signout();
    this.navCtrl.navigateRoot('sign-in');
  }

  sendMessage(): void {
    if (this.messageText && this.messageText.trim().length > 0) {
      this.chatService.send(this.messageText);
      this.messageText = '';
    }
  }

}
