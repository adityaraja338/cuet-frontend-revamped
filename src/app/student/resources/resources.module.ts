import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ResourcesComponent } from './resources.component';
import { BaseChartDirective } from 'ng2-charts';
import { NgZorroAntdModule } from '../../ng-zorro-antd.module';
import { FormsModule } from '@angular/forms';
import { ImageFallbackDirective } from '../../shared/directive/img-fallback.directive';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: ResourcesComponent },
  {
    path: '',
    children: [
      {
        path: ':subjectId',
        loadChildren: () =>
          import('./topics/topics.module').then((m) => m.TopicsModule),
      },
    ],
  },
];

@NgModule({
  declarations: [ResourcesComponent],
  imports: [
    RouterModule.forChild(routes),
    BaseChartDirective,
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ImageFallbackDirective,
  ],
  exports: [ResourcesComponent],
})
export class ResourcesModule {}
