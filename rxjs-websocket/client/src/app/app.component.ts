import { Component, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { catchError, concatMap, delay, filter, tap } from 'rxjs/operators';
import { Observable, of, race, Subject, Subscription, throwError, timer } from 'rxjs';
import { format } from 'date-fns';
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';
import { FormsModule } from '@angular/forms';
import { Calculation, Result } from './protos/calculator';

type CalculatorOperator = 'Addition' | 'Subtraction' | 'Multiplication' | 'Division';
type SensorConnectionState = 'closed' | 'connecting' | 'open' | 'error';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [NgxEchartsDirective, FormsModule],
})
export class AppComponent implements OnDestroy {
  options: EChartsOption;
  mergeOptions: EChartsOption;
  type: 'temp' | 'hum' = 'temp';
  connected = false;
  networkError = false;
  sensorConnectionState: SensorConnectionState = 'closed';
  calculatorValue1 = 10;
  calculatorValue2 = 5;
  calculatorOperator: CalculatorOperator = 'Addition';
  calculationResult: number | null = null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private webSocketSubject: WebSocketSubject<any> | null = null;
  private heartbeatSubscription: Subscription | null = null;
  private dataSubscription: Subscription | null = null;

  private tempOptions: EChartsOption = {
    series: [
      {
        name: 'Temperature',
        type: 'gauge',
        min: -20,
        max: 50,
        splitNumber: 7,
        detail: {
          formatter: '{value} °C',
        },
        axisLine: {
          lineStyle: {
            color: [
              [0.29, 'blue'],
              [0.72, 'green'],
              [1, 'red'],
            ],
          },
        },
        data: [],
      },
    ],
  };

  private humOptions: EChartsOption = {
    series: [
      {
        name: 'Humidity',
        type: 'gauge',
        min: 0,
        max: 100,
        splitNumber: 10,
        detail: {
          formatter: '{value} %',
        },
        axisLine: {
          lineStyle: {
            color: [
              [0.2, 'lightblue'],
              [0.5, 'blue'],
              [1, 'darkblue'],
            ],
          },
        },
        data: [],
      },
    ],
  };

  constructor() {
    this.options = this.tempOptions;
    this.mergeOptions = { series: { data: [{ value: NaN, name: '' }] } };
  }

  startHeartbeat(): void {
    this.stopHeartbeat();
    this.networkError = false;

    const heartbeat$ = timer(1_000, 30_000).pipe(
      tap(() => this.connect().next('ping')),
      concatMap(() => {
        return race(
          of('timeout').pipe(delay(3_000)),
          this.connect().pipe(
            filter((m) => m === 'pong'),
            catchError(() => of('error')),
          ),
        );
      }),
    );

    this.heartbeatSubscription = heartbeat$.subscribe((msg) => {
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
      this.connected = false;
      this.disconnect();
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
      this.sensorConnectionState = 'connecting';

      const closeSubject = new Subject<CloseEvent>();
      closeSubject.subscribe(() => {
        this.webSocketSubject = null;
        this.sensorConnectionState = this.connected ? 'error' : 'closed';
        if (this.connected) {
          this.networkError = true;
        }
      });

      this.webSocketSubject = webSocket({
        url: 'ws://localhost:8080/sensor',
        closeObserver: closeSubject,
        openObserver: {
          next: () => {
            this.sensorConnectionState = 'open';
            this.networkError = false;
          },
        },
      });

      this.startListening();

      this.startHeartbeat();
    }
    return this.webSocketSubject;
  }

  disconnect(): void {
    this.sensorConnectionState = 'closed';

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
    this.calculationResult = null;

    const operation = this.getCalculationOperation(this.calculatorOperator);

    const ws = webSocket({
      binaryType: 'arraybuffer',
      url: 'ws://localhost:8080/calculator',
      serializer: (v) => v as ArrayBuffer,
      deserializer: (v) => v.data,
      openObserver: {
        next: () => {
          const calculaton = Calculation.encode({
            operation,
            value1: this.calculatorValue1,
            value2: this.calculatorValue2,
          }).finish();
          const offset = calculaton.byteOffset;
          const length = calculaton.byteLength;
          ws.next(calculaton.buffer.slice(offset, offset + length));
        },
      },
    });

    const sub = ws.subscribe((response) => {
      const result = Result.decode(new Uint8Array(response as ArrayBuffer));
      this.calculationResult = result.result;
      ws.complete();
      sub.unsubscribe();
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getDataObservable(): Observable<any> {
    if (!this.webSocketSubject) {
      return throwError(() => new Error('websocket subject not set'));
    }
    if (this.type === 'temp') {
      return this.webSocketSubject.multiplex(
        () => 'subscribe-temp',
        () => 'unsubscribe-temp',
        (message) => message.temperature,
      );
    } else {
      return this.webSocketSubject.multiplex(
        () => 'subscribe-hum',
        () => 'unsubscribe-hum',
        (message) => message.humidity,
      );
    }
  }

  private startListening(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }

    this.dataSubscription = this.getDataObservable().subscribe((data) => {
      const ts = format(new Date(data.ts * 1000), 'HH:mm:ss');
      if (this.type === 'temp') {
        this.mergeOptions = { series: { data: [{ value: data.temperature, name: ts }] } };
      } else {
        this.mergeOptions = { series: { data: [{ value: data.humidity, name: ts }] } };
      }
    });
  }

  private getCalculationOperation(operator: CalculatorOperator): number {
    switch (operator) {
      case 'Addition':
        return Calculation.Operation.Addition;
      case 'Subtraction':
        return Calculation.Operation.Subtraction;
      case 'Multiplication':
        return Calculation.Operation.Multiplication;
      case 'Division':
        return Calculation.Operation.Division;
    }
  }
}
