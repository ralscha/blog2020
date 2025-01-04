import {Component, OnDestroy} from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {catchError, concatMap, delay, filter, retryWhen, tap} from 'rxjs/operators';
import {Observable, of, race, Subject, Subscription, throwError, timer} from 'rxjs';
import {format} from 'date-fns';
import {Calculation, Result} from './protos/calculator';
import {EChartsOption} from 'echarts';
import Operation = Calculation.Operation;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnDestroy {
  options: EChartsOption;
  mergeOptions: EChartsOption;
  type: 'temp' | 'hum' = 'temp';
  connected = false;
  networkError = false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private webSocketSubject: WebSocketSubject<any> | null = null;
  private heartbeatSubscription: Subscription | null = null;
  private dataSubscription: Subscription | null = null;

  private tempOptions: EChartsOption = {
    series: [{
      name: 'Temperature',
      type: 'gauge',
      min: -20,
      max: 50,
      splitNumber: 7,
      detail: {
        formatter: '{value} °C'
      },
      axisLine: {
        lineStyle: {
          color: [[0.29, 'blue'], [0.72, 'green'], [1, 'red']]
        }
      },
      data: []
    }]
  };

  private humOptions: EChartsOption = {
    series: [{
      name: 'Humidity',
      type: 'gauge',
      min: 0,
      max: 100,
      splitNumber: 10,
      detail: {
        formatter: '{value} %'
      },
      axisLine: {
        lineStyle: {
          color: [[0.2, 'lightblue'], [0.5, 'blue'], [1, 'darkblue']]
        }
      },
      data: []
    }]
  };

  constructor() {
    this.options = this.tempOptions;
    this.mergeOptions = {series: {data: [{value: NaN, name: ''}]}};

    const webSocketSubject = webSocket('ws://localhost:8080/sensor');
    webSocketSubject.pipe(retryWhen((errors) => errors.pipe(delay(10_000))))
      .subscribe(value => console.log(value));
  }

  startHeartbeat(): void {
    this.stopHeartbeat();
    this.networkError = false;

    const heartbeat$ = timer(1_000, 30_000)
      .pipe(
        tap(() => this.connect().next('ping')),
        concatMap(() => {
          return race(
            of('timeout').pipe(delay(3_000)),
            this.connect().pipe(filter(m => m === 'pong'), catchError(() => of('error')))
          );
        })
      );

    this.heartbeatSubscription = heartbeat$.subscribe(msg => {
      if (msg === 'pong') {
        this.networkError = false;
      } else {
        this.networkError = true;
        this.webSocketSubject?.complete();
        this.webSocketSubject = null;
      }
    });
  }

  stopHeartbeat(): void {
    if (this.heartbeatSubscription) {
      this.heartbeatSubscription.unsubscribe();
    }
  }

  toggleConnection(): void {
    if (this.connected) {
      this.disconnect();
      this.connected = false;
      this.networkError = false;
    } else {
      this.connect();
      this.connected = true;
    }
  }

  switchGauge(): void {
    if (this.type === 'temp') {
      this.options = this.tempOptions;
    } else {
      this.options = this.humOptions;
    }

    if (this.connected) {
      this.startListening();
    }

  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  connect(): WebSocketSubject<any> {
    if (!this.webSocketSubject) {
      const closeSubject = new Subject<CloseEvent>();
      closeSubject.subscribe(() => {
        this.webSocketSubject = null;
        if (this.connected) {
          this.networkError = true;
        }
      });

      this.webSocketSubject = webSocket({
        url: 'ws://localhost:8080/sensor',
        closeObserver: closeSubject,
        openObserver: {
          next: () => console.log('connection open')
        }
      });

      this.startListening();

      this.startHeartbeat();
    }
    return this.webSocketSubject;
  }

  disconnect(): void {
    if (this.webSocketSubject) {
      this.stopHeartbeat();
      this.networkError = false;

      this.webSocketSubject.complete();
      this.webSocketSubject = null;
    }
  }

  ngOnDestroy(): void {
    this.disconnect();
  }

  sendCalculation(): void {
    /*
    const w = new WebSocket('ws://localhost:8080/calculator');
    w.binaryType = 'arraybuffer';
    w.onopen = () => {
      const calculaton = Calculation.encode({operation: Operation.Addition, value1: 10, value2: 5}).finish();
      const offset = calculaton.byteOffset;
      const length = calculaton.byteLength;
      w.send(calculaton.buffer.slice(offset, offset + length));
    };
    w.onmessage = msg => {
      console.log(msg.data);
      const result = Result.decode(new Uint8Array(msg.data));
      console.log(result.result);
    };
    */
    const value1Element = document.getElementById('value1') as HTMLInputElement;
    const value2Element = document.getElementById('value2') as HTMLInputElement;
    const operatorElement = document.getElementById('operator') as HTMLInputElement;
    const resultElement = document.getElementById('result') as HTMLInputElement;

    let operation: number;
    switch (operatorElement.value) {
      case 'Addition':
        operation = Operation.Addition;
        break;
      case 'Subtraction':
        operation = Operation.Subtraction;
        break;
      case 'Multiplication':
        operation = Operation.Multiplication;
        break;
      case 'Division':
        operation = Operation.Division;
        break;
    }

    const ws = webSocket({
      binaryType: 'arraybuffer',
      url: 'ws://localhost:8080/calculator',
      serializer: v => v as ArrayBuffer,
      deserializer: v => v.data,
      openObserver: {
        next: () => {
          const calculaton = Calculation.encode({
            operation,
            value1: parseFloat(value1Element.value),
            value2: parseFloat(value2Element.value)
          }).finish();
          const offset = calculaton.byteOffset;
          const length = calculaton.byteLength;
          ws.next(calculaton.buffer.slice(offset, offset + length));
        }
      }
    });

    const sub = ws.subscribe(response => {
      const result = Result.decode(new Uint8Array(response as ArrayBuffer));
      resultElement.innerText = String(result.result);
      sub.unsubscribe();
    });

    /*
    const ws = webSocket({
      binaryType: 'arraybuffer',
      url: 'ws://localhost:8080/calculator',
      serializer: (msg: Uint8Array) => {
        const offset = msg.byteOffset;
        const length = msg.byteLength;
        return msg.buffer.slice(offset, offset + length);
      },
      deserializer: msg => new Uint8Array(msg.data as ArrayBuffer),
      openObserver: {
        next: () => {
          const calculaton = Calculation.encode({
            operation,
            value1: parseFloat(value1Element.value),
            value2: parseFloat(value2Element.value)
          }).finish();
          ws.next(calculaton);
        }
      }
    });

    const sub = ws.subscribe(response => {
      const result = Result.decode(response);
      resultElement.innerText = String(result.result);
      sub.unsubscribe();
    });
    */
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getDataObservable(): Observable<any> {
    if (!this.webSocketSubject) {
      return throwError(() => new Error('websocket subject not set'));
    }
    if (this.type === 'temp') {
      return this.webSocketSubject.multiplex(() => 'subscribe-temp', () => 'unsubscribe-temp', message => message.temperature);
    } else {
      return this.webSocketSubject.multiplex(() => 'subscribe-hum', () => 'unsubscribe-hum', message => message.humidity);
    }
  }

  private startListening(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }

    this.dataSubscription = this.getDataObservable().subscribe(data => {
      const ts = format(new Date(data.ts * 1000), 'HH:mm:ss');
      if (this.type === 'temp') {
        this.mergeOptions = {series: {data: [{value: data.temperature, name: ts}]}};
      } else {
        this.mergeOptions = {series: {data: [{value: data.humidity, name: ts}]}};
      }
    });
  }

}
