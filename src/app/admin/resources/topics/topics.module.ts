import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopicsComponent } from './topics.component';
import { MaterialsComponent } from './materials/materials.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: TopicsComponent },
  {
    path: '',
    children: [
      {
        path: ':topic',
        component: MaterialsComponent
      },
    ],
  },
];

@NgModule({
  declarations: [
    TopicsComponent,
    MaterialsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class TopicsModule { }
