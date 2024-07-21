import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatchesComponent } from './batches.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: BatchesComponent },
  // {
  //   path: '',
  //   children: [
  //     {
  //       path: ':topic',
  //       component: MaterialsComponent
  //     },
  //   ],
  // },
];

@NgModule({
  declarations: [
    BatchesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class BatchesModule { }
