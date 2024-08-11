import { NgModule } from '@angular/core';
import { PerformancesComponent } from './performances.component';
import { RouterModule, Routes } from '@angular/router';
import { NgZorroAntdModule } from '../../ng-zorro-antd.module';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  { path: '', component: PerformancesComponent },
  { path: '**', redirectTo: '/student/performances' },
];

@NgModule({
  declarations: [PerformancesComponent],
  imports: [RouterModule.forChild(routes), NgZorroAntdModule, CommonModule],
  exports: [PerformancesComponent],
})
export class PerformancesModule {}
