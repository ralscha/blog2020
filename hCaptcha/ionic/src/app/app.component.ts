import {Component, inject} from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {IonApp, IonButton, IonContent, IonInput, IonItem, ToastController} from '@ionic/angular/standalone';
import {NgHcaptchaModule} from "ng-hcaptcha";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [FormsModule, IonApp, IonContent, IonItem, IonInput, NgHcaptchaModule, IonButton]
})
export class AppComponent {
  private readonly httpClient = inject(HttpClient);
  private toastController = inject(ToastController);


  submit(form: NgForm): void {
    const formData = new FormData();
    formData.append('email', form.value.email);
    formData.append('username', form.value.username);
    formData.append('h-captcha-response', form.value.captcha);

    this.httpClient.post<boolean>('/signup', formData).subscribe(
      ok => {
        if (ok) {
          this.toastController.create({
            message: 'Sign up successful.',
            duration: 4000
          }).then(toast => toast.present());
        } else {
          this.toastController.create({
            message: 'Something went wrong.',
            duration: 4000
          }).then(toast => toast.present());
        }
      }
    );
  }

}
