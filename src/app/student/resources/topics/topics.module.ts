import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { MaterialsComponent } from './materials/materials.component';
import { RouterModule, Routes } from '@angular/router';
import { TopicsComponent } from './topics.component';
import { NgZorroAntdModule } from '../../../ng-zorro-antd.module';
import { CommonModule, NgForOf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: TopicsComponent },
  {
    path: '',
    children: [
      {
        path: ':topicId',
        component: MaterialsComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [TopicsComponent, MaterialsComponent],
  imports: [
    RouterModule.forChild(routes),
    NgZorroAntdModule,
    NgForOf,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [TopicsComponent, MaterialsComponent],
})
export class TopicsModule {}
