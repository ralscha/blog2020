import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ChatService} from '../services/chat.service';
import {IonContent, IonList, NavController} from '@ionic/angular';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss']
})
export class MessagesPage implements OnInit {

  messageText: string = null;

  @ViewChild(IonContent, {static: true}) content: IonContent;
  @ViewChild(IonList, {read: ElementRef, static: true})
  private chatElement: ElementRef;
  private mutationObserver: MutationObserver;

  constructor(public readonly chatService: ChatService,
              private readonly navCtrl: NavController) {
  }

  ngOnInit(): void {
    this.mutationObserver = new MutationObserver(_ => {
      setTimeout(() => {
        this.content.scrollToBottom();
      }, 100);
    });
    this.mutationObserver.observe(this.chatElement.nativeElement, {
      childList: true
    });
  }

  signout() {
    this.chatService.signout();
    this.navCtrl.navigateRoot('sign-in');
  }

  sendMessage() {
    if (this.messageText && this.messageText.trim().length > 0) {
      this.chatService.send(this.messageText);
      this.messageText = '';
    }
  }

}
