import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
// @ts-ignore
import cettia from 'cettia-client/cettia-bundler';
import {BehaviorSubject} from 'rxjs';
import {Message} from '../models/message';
import {User} from '../models/user';
import {EncryptedMessage} from '../models/encrypted-message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  room: string | null = null;
  username: string | null = null;

  usersSubject = new BehaviorSubject<User[]>([]);
  messagesSubject = new BehaviorSubject<Message[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private socket: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private cache: any[] = [];

  private generateKeyPairPromise!: Promise<ArrayBuffer>;
  private myKeyPair!: CryptoKeyPair;
  private generateSharedKeysPromise: Promise<void[] | void> | null = null;

  private textDecoder: TextDecoder = new TextDecoder();
  private textEncoder: TextEncoder = new TextEncoder();

  init(): void {
    this.generateKeyPairPromise = this.generateKeyPair();

    this.socket = cettia.open(`${environment.SERVER_URL}/cettia`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.socket.on('cache', (args: any) => this.cache.push(args));
    this.socket.on('open', () => {
      while (this.socket.state() === 'opened' && this.cache.length) {
        const args = this.cache.shift();
        this.socket.send.apply(this.socket, args);
      }
    });

    this.socket.on('users', (users: User[]) => {
      this.usersSubject.next(users);
      this.generateSharedKeysPromise = this.generateSharedKeys();
    });

    this.socket.on('join', (user: User) => {
      this.usersSubject.next([user, ...this.usersSubject.getValue()]);
      this.addMessage({
        type: 'SYSTEM',
        user: user.username,
        msg: 'has joined the room',
        ts: Math.floor(Date.now() / 1000)
      });
      this.generateSharedKeysPromise = this.generateKeyPairPromise.then(() => this.generateSharedKey(user));
    });

    this.socket.on('leave', (username: string) => {
      this.usersSubject.next([...this.usersSubject.getValue().filter(u => u.username !== username)]);
      this.addMessage({type: 'SYSTEM', user: username, msg: 'has left the room', ts: Math.floor(Date.now() / 1000)});
    });

    this.socket.on('message', async (msg: EncryptedMessage) => {
      const decryptedMessage = await this.decrypt(msg.user, msg.msg);
      this.addMessage({
        user: msg.user,
        ts: msg.ts,
        msg: decryptedMessage,
        img: 'guy1.png',
        type: 'MSG'
      });
    });
  }

  async signin(username: string, room: string): Promise<boolean> {
    const rawPublicKey = await this.generateKeyPairPromise;
    this.room = room;
    this.username = username;

    return new Promise<boolean>(resolve => {
      this.socket.send('join', {username, room, publicKey: new Uint8Array(rawPublicKey)}, (ok: boolean) => {
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

    for (const user of this.usersSubject.getValue().filter(u => u.username !== this.username)) {
      this.encrypt(user.username, msg)
        .then(encryptedMsg => this.socket.send('message', {toUser: user.username, msg: encryptedMsg, ts}));
    }

    this.addMessage({ts, msg, user: this.username, type: 'MSG', img: 'guy1.png'});
  }

  private addMessage(newMessage: Message): void {
    const messages = this.messagesSubject.getValue();
    messages.push(newMessage);

    const len = messages.length;
    this.messagesSubject.next(messages.slice(len - 50, len));
  }

  private async generateKeyPair(): Promise<ArrayBuffer> {
    try {
      this.myKeyPair = await window.crypto.subtle.generateKey({
        name: 'ECDH',
        namedCurve: 'P-256'
      }, false, ['deriveKey']);
      return await window.crypto.subtle.exportKey('raw', this.myKeyPair!.publicKey!);
    } catch (err) {
      throw err;
    }
  }

  private async generateSharedKeys(): Promise<void[]> {
    const users = this.usersSubject.getValue();
    return Promise.all(users.filter(user => user.username !== this.username).map(user => this.generateSharedKey(user)));
  }

  private async generateSharedKey(user: User): Promise<void> {
    const publicKey = await window.crypto.subtle.importKey('raw', user.publicKey,
      {name: 'ECDH', namedCurve: 'P-256'}, false, []);

    user.sharedKey = await window.crypto.subtle.deriveKey(
      {name: 'ECDH', public: publicKey},
      this.myKeyPair!.privateKey!,
      {name: 'AES-GCM', length: 256}, false, ['encrypt', 'decrypt']
    );
  }

  private async encrypt(toUsername: string, plainTextMsg: string): Promise<Uint8Array> {

    if (!this.username) {
      throw new Error('username not set');
    }

    await this.generateKeyPairPromise;
    const user = this.usersSubject.getValue().find(u => u.username === toUsername);

    if (!user?.sharedKey) {
      throw new Error('shared key not set');
    }

    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const encryptedMsg = await window.crypto.subtle.encrypt(
      {name: 'AES-GCM', iv, tagLength: 128, additionalData: this.textEncoder.encode(this.username)},
      user.sharedKey,
      this.textEncoder.encode(plainTextMsg)
    );

    return ChatService.concatUint8Array(iv, new Uint8Array(encryptedMsg));
  }

  private async decrypt(fromUsername: string, encryptedMsg: Uint8Array): Promise<string> {
    await this.generateKeyPairPromise;
    const user = this.usersSubject.getValue().find(u => u.username === fromUsername);

    if (!user?.sharedKey) {
      throw new Error('shared key not set');
    }

    const iv = encryptedMsg.slice(0, 12);
    const data = encryptedMsg.slice(12);

    const plainTextArrayBuffer = await window.crypto.subtle.decrypt(
      {name: 'AES-GCM', iv, tagLength: 128, additionalData: this.textEncoder.encode(fromUsername)},
      user.sharedKey,
      data
    );

    return this.textDecoder.decode(plainTextArrayBuffer);
  }

  private static concatUint8Array(...arrays: Uint8Array[]): Uint8Array {
    let totalLength = 0;
    for (const arr of arrays) {
      totalLength += arr.length;
    }
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const arr of arrays) {
      result.set(arr, offset);
      offset += arr.length;
    }
    return result;
  }

}
