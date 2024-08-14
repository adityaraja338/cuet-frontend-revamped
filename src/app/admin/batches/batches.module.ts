import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatchesComponent } from './batches.component';
import { RouterModule, Routes } from '@angular/router';
import { NgZorroAntdModule } from '../../ng-zorro-antd.module';
import { NzIconModule } from 'ng-zorro-antd/icon';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: BatchesComponent },
  { path: '**', redirectTo: '/admin/batches' },
];

@NgModule({
  declarations: [BatchesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgZorroAntdModule,
    NzIconModule,
  ],
})
export class BatchesModule {}
