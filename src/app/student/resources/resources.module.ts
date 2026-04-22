import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { NgZorroAntdModule } from '../../ng-zorro-antd.module';
import { ImageFallbackDirective } from '../../shared/directive/img-fallback.directive';

import { ResourcesComponent } from './resources.component';
import { ResourceTopicPanelComponent } from './topic-panel/topic-panel.component';
import { ResourceSkeletonComponent } from './skeleton/skeleton.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: ResourcesComponent },
];

@NgModule({
  declarations: [
    ResourcesComponent,
    ResourceTopicPanelComponent,
    ResourceSkeletonComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ImageFallbackDirective,
    NgOptimizedImage
  ],
  exports: [ResourcesComponent],
})
export class ResourcesModule {}
