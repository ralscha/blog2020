import {Component, inject} from '@angular/core';
import {ChatService} from '../services/chat.service';
import {AsyncPipe} from '@angular/common';
import {IonBadge, IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs} from "@ionic/angular/standalone";
import {addIcons} from "ionicons";
import {chatbubbles, people} from "ionicons/icons";

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  imports: [AsyncPipe, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge]
})
export class TabsPage {
  readonly chatService = inject(ChatService);

  constructor() {
    addIcons({people, chatbubbles});
  }
}
