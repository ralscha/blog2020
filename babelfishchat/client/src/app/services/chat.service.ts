import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
// @ts-ignore
import cettia from 'cettia-client/cettia-bundler';
import {BehaviorSubject} from 'rxjs';
import {Message} from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  room: string | null = null;
  username: string | null = null;

  usersSubject = new BehaviorSubject<string[]>([]);
  messagesSubject = new BehaviorSubject<Message[]>([]);

  // tslint:disable-next-line:no-any
  private socket: any = null;
  // tslint:disable-next-line:no-any
  private cache: any[] = [];

  init(): void {
    this.socket = cettia.open(`${environment.SERVER_URL}/cettia`);

    // tslint:disable-next-line:no-any
    this.socket.on('cache', (args: any) => this.cache.push(args));
    this.socket.on('open', () => {
      while (this.socket.state() === 'opened' && this.cache.length) {
        const args = this.cache.shift();
        this.socket.send.apply(this.socket, args);
      }
    });

    this.socket.on('users', (users: string[]) => this.usersSubject.next(users));

    this.socket.on('join', (username: string) => {
      this.usersSubject.next([username, ...this.usersSubject.getValue()]);
      this.addMessage({type: 'SYSTEM', user: username, msg: 'has joined the room', ts: Math.floor(Date.now() / 1000)});
    });

    this.socket.on('leave', (username: string) => {
      this.usersSubject.next([...this.usersSubject.getValue().filter(u => u !== username)]);
      this.addMessage({type: 'SYSTEM', user: username, msg: 'has left the room', ts: Math.floor(Date.now() / 1000)});
    });

    this.socket.on('message', (msg: Message) => {
      msg.img = 'guy1.png';
      msg.type = 'MSG';
      this.addMessage(msg);
    });
  }

  signin(username: string, room: string, language: string): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.socket.send('join', {username, room, language}, (ok: boolean) => {
        if (ok) {
          this.room = room;
          this.username = username;
        }
        resolve(ok);
      });
    });
  }

  signout(): void {
    if (this.socket !== null) {
      this.socket.send('leave', () => {
        this.socket.close();
        this.socket = null;
      });
    }
    this.username = null;
    this.room = null;
    this.usersSubject.next([]);
    this.messagesSubject.next([]);
  }

  send(msg: string): void {
    if (this.username === null) {
      throw new Error('username not set');
    }
    const ts = Math.floor(Date.now() / 1000);
    this.socket.send('message', {msg, ts});
    this.addMessage({ts, msg, user: this.username, type: 'MSG', img: 'guy1.png'});
  }

  private addMessage(newMessage: Message): void {
    const messages = this.messagesSubject.getValue();
    messages.push(newMessage);

    const len = messages.length;
    this.messagesSubject.next(messages.slice(len - 50, len));
  }

}
