import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatchesComponent } from './batches.component';
import { RouterModule, Routes } from '@angular/router';
import { NgZorroAntdModule } from '../../ng-zorro-antd.module';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormsModule } from '@angular/forms';
import { BatchDetailComponent } from './batch-detail/batch-detail.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: BatchesComponent },
  { path: '**', redirectTo: '/admin/batches' },
];

@NgModule({
  declarations: [BatchesComponent, BatchDetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgZorroAntdModule,
    NzIconModule,
    FormsModule,
  ],
})
export class BatchesModule {}
