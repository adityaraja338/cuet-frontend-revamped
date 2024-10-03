import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourcesComponent } from './resources.component';
import { RouterModule, Routes } from '@angular/router';
import { NgZorroAntdModule } from '../../ng-zorro-antd.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
    CommonModule,
    RouterModule.forChild(routes),
    NgZorroAntdModule,
    ReactiveFormsModule,
    FormsModule,
    ImageFallbackDirective,
  ],
})
export class ResourcesModule {}
