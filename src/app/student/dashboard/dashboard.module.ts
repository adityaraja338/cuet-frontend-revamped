import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { NgZorroAntdModule } from '../../ng-zorro-antd.module';
import { SimplebarAngularModule } from 'simplebar-angular';
import {
  BaseChartDirective,
  provideCharts,
  withDefaultRegisterables,
} from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { ImageFallbackDirective } from '../../shared/directive/img-fallback.directive';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: '**', redirectTo: '/student/home' },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    NgZorroAntdModule,
    SimplebarAngularModule,
    BaseChartDirective,
    CommonModule,
    ImageFallbackDirective,
  ],
  providers: [provideCharts(withDefaultRegisterables())],
  declarations: [DashboardComponent],
  exports: [DashboardComponent],
})
export class DashboardModule {}
