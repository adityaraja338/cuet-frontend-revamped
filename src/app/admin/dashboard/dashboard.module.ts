import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { NgZorroAntdModule } from '../../ng-zorro-antd.module';
import {
  BaseChartDirective,
  provideCharts,
  withDefaultRegisterables,
} from 'ng2-charts';
import { ImageFallbackDirective } from '../../shared/directive/img-fallback.directive';
import { SimplebarAngularModule } from 'simplebar-angular';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: '**', redirectTo: '/admin/home' },
];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgZorroAntdModule,
    BaseChartDirective,
    ImageFallbackDirective,
    SimplebarAngularModule,
  ],
  providers: [provideCharts(withDefaultRegisterables())],
  exports: [DashboardComponent],
})
export class DashboardModule {}
