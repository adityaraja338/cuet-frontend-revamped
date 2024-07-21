import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { MaterialsComponent } from './materials/materials.component';
import { RouterModule, Routes } from '@angular/router';
import { TopicsComponent } from './topics.component';

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
    RouterModule.forChild(routes)
  ],
  exports: [TopicsComponent, MaterialsComponent]
})
export class TopicsModule { }
