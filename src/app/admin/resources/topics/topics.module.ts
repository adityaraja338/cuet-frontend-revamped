import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopicsComponent } from './topics.component';
import { MaterialsComponent } from './materials/materials.component';
import { RouterModule, Routes } from '@angular/router';
import { NzBreadCrumbComponent } from 'ng-zorro-antd/breadcrumb';
import { NgZorroAntdModule } from '../../../ng-zorro-antd.module';
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
    CommonModule,
    RouterModule.forChild(routes),
    NgZorroAntdModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class TopicsModule {}
