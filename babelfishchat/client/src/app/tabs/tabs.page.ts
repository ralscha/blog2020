import {Component} from '@angular/core';
import {ChatService} from '../services/chat.service';

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.page.html',
    styleUrls: ['./tabs.page.scss'],
    standalone: false
})
export class TabsPage {

  constructor(public readonly chatService: ChatService) {
  }

}
