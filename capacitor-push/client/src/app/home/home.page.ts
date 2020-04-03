import {ChangeDetectorRef, Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {timeout} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {LocalNotificationActionPerformed, Plugins, PushNotificationActionPerformed} from '@capacitor/core';
import {FCM} from 'capacitor-fcm';

const fcm = new FCM();

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage {

  allowPush: boolean;
  allowPersonal: boolean;
  items: { id: number, text: string }[] = [];
  private readonly TOPIC_NAME = 'chuck';

  constructor(private readonly http: HttpClient,
              private readonly changeDetectorRef: ChangeDetectorRef) {
    const pushFlag = localStorage.getItem('allowPush');
    this.allowPush = pushFlag != null ? JSON.parse(pushFlag) : false;

    const personalFlag = localStorage.getItem('allowPersonal');
    this.allowPersonal = personalFlag != null ? JSON.parse(personalFlag) : false;

    this.initFCM().then(() => {
      this.onChange();
      this.onPmChange();
    });
  }

  async register() {
    await Plugins.PushNotifications.register();
    const {token} = await fcm.getToken();
    const formData = new FormData();
    formData.append('token', token);
    this.http.post(`${environment.serverURL}/register`, formData)
      .pipe(timeout(10000))
      .subscribe(() => localStorage.setItem('allowPersonal', JSON.stringify(this.allowPersonal)),
        _ => this.allowPersonal = !this.allowPersonal);
  }

  async unregister() {
    await Plugins.PushNotifications.register();
    const {token} = await fcm.getToken();
    const formData = new FormData();
    formData.append('token', token);
    this.http.post(`${environment.serverURL}/unregister`, formData)
      .pipe(timeout(10000))
      .subscribe(() => localStorage.setItem('allowPersonal', JSON.stringify(this.allowPersonal)),
        _ => this.allowPersonal = !this.allowPersonal);
  }

  onChange() {
    localStorage.setItem('allowPush', JSON.stringify(this.allowPush));

    if (this.allowPush) {
      fcm.subscribeTo({topic: this.TOPIC_NAME});
    } else {
      fcm.unsubscribeFrom({topic: this.TOPIC_NAME});
    }
  }

  onPmChange() {
    localStorage.setItem('allowPersonal', JSON.stringify(this.allowPersonal));

    if (this.allowPersonal) {
      this.register();
    } else {
      this.unregister();
    }
  }

  handleNotification(data) {
    if (!data.text) {
      return;
    }

    this.items.splice(0, 0, {id: data.id, text: data.text});

    // only keep the last 5 entries
    if (this.items.length > 5) {
      this.items.pop();
    }

    this.changeDetectorRef.detectChanges();
  }

  private async initFCM() {
    await Plugins.PushNotifications.register();

    Plugins.PushNotifications.addListener('registrationError',
      error => console.log('Error on registration: ' + JSON.stringify(error)));

    // Only called when app in foreground
    Plugins.PushNotifications.addListener('pushNotificationReceived',
      notification => {
        this.handleNotification(notification.data);

        Plugins.LocalNotifications.schedule({
          notifications: [{
            title: notification.title,
            body: notification.body,
            id: Date.now(),
            extra: notification.data,
            smallIcon: 'res://ic_stat_name'
          }]
        });
      }
    );

    // called when app in background and user taps on notification
    Plugins.PushNotifications.addListener('pushNotificationActionPerformed',
      (event: PushNotificationActionPerformed) => {
        this.handleNotification(event.notification.data);
      }
    );

    // called when app in foreground and user taps on local notification
    Plugins.LocalNotifications.addListener('localNotificationActionPerformed',
      (event: LocalNotificationActionPerformed) => {
        this.handleNotification(event.notification.extra);
      });

  }

}
