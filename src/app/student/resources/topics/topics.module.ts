import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { MaterialsComponent } from './materials/materials.component';
import { RouterModule, Routes } from '@angular/router';
import { TopicsComponent } from './topics.component';
import {NgZorroAntdModule} from "../../../ng-zorro-antd.module";
import {NgForOf} from "@angular/common";

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
  declarations: [TopicsComponent, MaterialsComponent],
  imports: [RouterModule.forChild(routes), NgZorroAntdModule, NgForOf],
  exports: [TopicsComponent, MaterialsComponent],
})
export class TopicsModule {}
