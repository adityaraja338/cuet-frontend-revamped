import { NgModule } from '@angular/core';
import { PerformancesComponent } from './performances.component';
import { RouterModule, Routes } from '@angular/router';
import { NgZorroAntdModule } from '../../ng-zorro-antd.module';
import { CommonModule } from '@angular/common';
import {
  BaseChartDirective,
  provideCharts,
  withDefaultRegisterables,
} from 'ng2-charts';
import { SimplebarAngularModule } from 'simplebar-angular';

const routes: Routes = [
  { path: '', component: PerformancesComponent },
  { path: '**', redirectTo: '/student/performances' },
];

@NgModule({
  declarations: [PerformancesComponent],
  imports: [
    RouterModule.forChild(routes),
    NgZorroAntdModule,
    CommonModule,
    BaseChartDirective,
    SimplebarAngularModule,
  ],
  providers: [provideCharts(withDefaultRegisterables())],
  exports: [PerformancesComponent],
})
export class PerformancesModule {}
