import {ChangeDetectorRef, Component} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {timeout} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {ActionPerformed, PushNotifications} from '@capacitor/push-notifications';
import {FCM} from '@capacitor-community/fcm';
import {ActionPerformed as LocalActionPerformed, LocalNotifications} from '@capacitor/local-notifications';
import {Capacitor} from '@capacitor/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
    standalone: false
})
export class HomePage {

  errorMessage = "";
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

  async register(): Promise<void> {
    const token = await this.getFcmToken();
    const formData = new FormData();
    formData.append('token', token);
    this.http.post(`${environment.serverURL}/register`, formData)
      .pipe(timeout(10000))
      .subscribe(
        {
          next: () => localStorage.setItem('allowPersonal', JSON.stringify(this.allowPersonal)),
          error: err => this.errorMessage = err.message
        }
      );
  }

  async unregister(): Promise<void> {
    const token = await this.getFcmToken();
    const formData = new FormData();
    formData.append('token', token);
    this.http.post(`${environment.serverURL}/unregister`, formData)
      .pipe(timeout(10000))
      .subscribe(
        {
          next: () => localStorage.setItem('allowPersonal', JSON.stringify(this.allowPersonal)),
          error: err => this.errorMessage = err.message
        }
      );
  }

  onChange(): void {
    localStorage.setItem('allowPush', JSON.stringify(this.allowPush));

    if (this.allowPush) {
      FCM.subscribeTo({topic: this.TOPIC_NAME});
    } else {
      FCM.unsubscribeFrom({topic: this.TOPIC_NAME});
    }
  }

  onPmChange(): void {
    localStorage.setItem('allowPersonal', JSON.stringify(this.allowPersonal));

    if (this.allowPersonal) {
      this.register();
    } else {
      this.unregister();
    }
  }

  handleNotification(data: { text: string, id: number }): void {
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

  private async initFCM(): Promise<void> {
    await PushNotifications.requestPermissions();
    await LocalNotifications.requestPermissions();

    PushNotifications.addListener('registrationError',
      error => console.log('Error on registration: ' + JSON.stringify(error)));

    // Only called when app in foreground
    PushNotifications.addListener('pushNotificationReceived',
      notification => {
        this.handleNotification(notification.data);

        LocalNotifications.schedule({
          notifications: [{
            title: notification.title ?? '',
            body: notification.body ?? '',
            id: Date.now(),
            extra: notification.data,
            smallIcon: 'res://ic_stat_name'
          }]
        });
      }
    );

    // called when app in background and user taps on notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      (event: ActionPerformed) => {
        this.handleNotification(event.notification.data);
      }
    );

    // called when app in foreground and user taps on local notification
    LocalNotifications.addListener('localNotificationActionPerformed',
      (event: LocalActionPerformed) => {
        this.handleNotification(event.notification.extra);
      });

  }

  // https://github.com/capacitor-community/fcm/issues/99
  /**
   * Returns `true` if the user gave permission or false otherwise.
   */
  async askFcmPermission(): Promise<boolean> {
    const checked = await PushNotifications.checkPermissions()
    let status: 'prompt' | 'prompt-with-rationale' | 'granted' | 'denied' = checked.receive

    if (status === 'prompt' || status === 'prompt-with-rationale') {
      const requested = await PushNotifications.requestPermissions()
      status = requested.receive;
    }

    return status === 'granted'
  }

  /**
   * Gets the FCM token in a non-breaking way.
   *
   * - For iOS we must use the `FCM` plugin, because `PushNotifications` returns the wrong APN token.
   * - For Android we must use `PushNotifications`, because `FCM` is broken for Android.
   * @see https://github.com/capacitor-community/fcm/issues/99
   */
  getFcmToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (Capacitor.getPlatform() === 'web') return resolve('')

      PushNotifications.addListener('registration', ({ value }) => {
        if (Capacitor.getPlatform() === 'android') {
          resolve(value)
          return
        }

        // Get FCM token instead the APN one returned by Capacitor
        if (Capacitor.getPlatform() === 'ios') {
          FCM.getToken()
            .then(({ token }) => resolve(token))
            .catch((error) => reject(error))
          return
        }

        // will never come here
        reject(new Error('?'))
      })

      this.askFcmPermission()
        .then((granted) => {
          if (granted) {
            PushNotifications.register().catch((error) => reject(error))
          } else {
            reject(new Error('denied'))
          }
        })
        .catch((error) => reject(error))
    })
  }
}
