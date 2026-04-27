import { NgModule } from '@angular/core';
import { PerformancesComponent } from './performances.component';
import { PerformanceDetailComponent } from './performance-detail/performance-detail.component';
import { RouterModule, Routes } from '@angular/router';
import { NgZorroAntdModule } from '../../ng-zorro-antd.module';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  { path: '', component: PerformancesComponent },
  { path: 'detail/:testId', component: PerformanceDetailComponent },
  { path: '**', redirectTo: '/student/performances' },
];

@NgModule({
  declarations: [PerformancesComponent, PerformanceDetailComponent],
  imports: [
    RouterModule.forChild(routes),
    NgZorroAntdModule,
    CommonModule,
  ],
  exports: [PerformancesComponent],
})
export class PerformancesModule {}
