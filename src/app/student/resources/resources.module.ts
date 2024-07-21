import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ResourcesComponent } from './resources.component';

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
  declarations: [ResourcesComponent],
  imports: [RouterModule.forChild(routes)],
  exports: [ResourcesComponent]
})
export class ResourcesModule {}
