import { Component, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { IUserResponse, UserRequest, UserResponse } from './protos/user';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { FormField, FormRoot, form } from '@angular/forms/signals';

interface UserForm {
  firstname: string;
  lastname: string;
  age: number;
  gender: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [FormField, FormRoot],
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly userModel = signal<UserForm>({
    firstname: '',
    lastname: '',
    age: 0,
    gender: 'MALE',
  });
  readonly userForm = form(this.userModel);

  private readonly httpClient = inject(HttpClient);

  submit(): void {
    const formValues = this.userModel();
    const encodedUserRequest = UserRequest.encode({
      firstname: formValues.firstname,
      lastname: formValues.lastname,
      age: formValues.age,
      gender: formValues.gender === 'MALE' ? UserRequest.Gender.MALE : UserRequest.Gender.FEMALE,
    }).finish();

    const offset = encodedUserRequest.byteOffset;
    const length = encodedUserRequest.byteLength;
    const userRequestArrayBuffer = encodedUserRequest.buffer.slice(offset, offset + length);

    const headers = new HttpHeaders({
      Accept: 'application/x-protobuf',
      'Content-Type': 'application/x-protobuf',
    });

    this.httpClient
      .post(`${environment.SERVER_URL}/register-user`, userRequestArrayBuffer, {
        headers,
        responseType: 'arraybuffer',
      })
      .pipe(
        map((response) => this.parseProtobuf(response)),
        catchError(this.handleError),
      )
      .subscribe(this.handleResponse);
  }

  parseProtobuf(response: ArrayBuffer): IUserResponse {
    return UserResponse.decode(new Uint8Array(response));
  }

  handleResponse(userResponse: IUserResponse): void {
    console.log(`ID: ${userResponse.id}`);
    console.log(`Status: ${userResponse.status === UserResponse.Status.OK ? 'OK' : 'NOT_OK'}`);
  }

  handleError(error: unknown): Observable<never> {
    console.error(error);
    return throwError(() => error || 'Server error');
  }
}
