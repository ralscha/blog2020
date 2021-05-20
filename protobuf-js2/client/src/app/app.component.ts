import {Component} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../environments/environment';
import {IUserResponse, UserRequest, UserResponse} from './protos/user';
import {catchError, map} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private readonly httpClient: HttpClient) {
  }

  submit(formValues: { firstname: string, lastname: string, age: number, gender: string }): void {

    const encodedUserRequest = UserRequest.encode({
      firstname: formValues.firstname,
      lastname: formValues.lastname,
      age: formValues.age,
      gender: (formValues.gender === 'MALE') ? UserRequest.Gender.MALE : UserRequest.Gender.FEMALE
    }).finish();

    const offset = encodedUserRequest.byteOffset;
    const length = encodedUserRequest.byteLength;
    const userRequestArrayBuffer = encodedUserRequest.buffer.slice(offset, offset + length);

    const headers = new HttpHeaders({
      Accept: 'application/x-protobuf',
      'Content-Type': 'application/x-protobuf'
    });

    this.httpClient.post(`${environment.SERVER_URL}/register-user`, userRequestArrayBuffer, {headers, responseType: 'arraybuffer'})
      .pipe(
        map(response => this.parseProtobuf(response)),
        catchError(this.handleError)
      ).subscribe(this.handleResponse);
  }

  parseProtobuf(response: ArrayBuffer): IUserResponse {
    return UserResponse.decode(new Uint8Array(response));
  }

  handleResponse(userResponse: IUserResponse): void {
    console.log(`ID: ${userResponse.id}`);
    console.log(`Status: ${userResponse.status === UserResponse.Status.OK ? 'OK' : 'NOT_OK'}`);
  }

  handleError(error: any): Observable<any> {
    console.error(error);
    return throwError(() => error || 'Server error');
  }
}
