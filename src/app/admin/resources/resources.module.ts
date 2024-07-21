import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourcesComponent } from './resources.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: ResourcesComponent },
  {
    path: '',
    children: [
      {
        path: ':subject',
        loadChildren: () =>
          import('./topics/topics.module').then((m) => m.TopicsModule),
      },
    ],
  },
];

@NgModule({
  declarations: [
    ResourcesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ResourcesModule { }
