import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private readonly httpClient: HttpClient,
              private toastController: ToastController) {
  }

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
            message: 'Something wrent wrong.',
            duration: 4000
          }).then(toast => toast.present());
        }
      }
    );
  }

}
