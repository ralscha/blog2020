import { provideZoneChangeDetection } from "@angular/core";
import {bootstrapApplication} from '@angular/platform-browser';
import {provideEchartsCore} from 'ngx-echarts';
import {AppComponent} from './app/app.component';

// import echarts core
import * as echarts from 'echarts/core';
// import necessary echarts components
import {GaugeChart} from 'echarts/charts';
import {CanvasRenderer} from 'echarts/renderers';

echarts.use([GaugeChart, CanvasRenderer]);

bootstrapApplication(AppComponent, {
  providers: [provideZoneChangeDetection(),provideEchartsCore({echarts})]
})
  .catch(err => console.error(err));
