import { Component, inject, signal } from '@angular/core';
import { FormField, FormRoot, form } from '@angular/forms/signals';
import { HttpClient } from '@angular/common/http';
import {
  IonApp,
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  ToastController,
} from '@ionic/angular/standalone';
import { NgHcaptchaModule } from 'ng-hcaptcha';

interface SignupForm {
  username: string;
  email: string;
  captcha: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    FormField,
    FormRoot,
    IonApp,
    IonContent,
    IonItem,
    IonInput,
    NgHcaptchaModule,
    IonButton,
  ],
})
export class AppComponent {
  readonly signupModel = signal<SignupForm>({
    username: '',
    email: '',
    captcha: '',
  });
  readonly signupForm = form(this.signupModel);

  private readonly httpClient = inject(HttpClient);
  private toastController = inject(ToastController);

  submit(): void {
    const { email, username, captcha } = this.signupModel();
    const formData = new FormData();
    formData.append('email', email);
    formData.append('username', username);
    formData.append('h-captcha-response', captcha);

    this.httpClient.post<boolean>('/signup', formData).subscribe((ok) => {
      if (ok) {
        this.toastController
          .create({
            message: 'Sign up successful.',
            duration: 4000,
          })
          .then((toast) => toast.present());
      } else {
        this.toastController
          .create({
            message: 'Something went wrong.',
            duration: 4000,
          })
          .then((toast) => toast.present());
      }
    });
  }
}
