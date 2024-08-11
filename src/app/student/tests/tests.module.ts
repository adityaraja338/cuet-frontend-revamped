import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { TestsComponent } from './tests.component';
import { NgZorroAntdModule } from '../../ng-zorro-antd.module';

const routes: Routes = [
  { path: '', component: TestsComponent },
  { path: '**', redirectTo: '/student/tests' },
];

@NgModule({
  declarations: [TestsComponent],
  imports: [CommonModule, RouterModule.forChild(routes), NgZorroAntdModule],
})
export class TestsModule {}
