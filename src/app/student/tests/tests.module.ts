import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { TestsComponent } from './tests.component';
import { NgZorroAntdModule } from '../../ng-zorro-antd.module';
import { IconsProviderModule } from '../../icons-provider.module';
import { TestAttemptComponent } from './test-attempt/test-attempt.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: TestsComponent },
  { path: 'attempt/live/:testId', component: TestAttemptComponent },
  { path: 'attempt/recorded/:testId', component: TestAttemptComponent },
  { path: 'attempt/mock/:testId', component: TestAttemptComponent },
  { path: 'attempt/topic/:testId', component: TestAttemptComponent },
  { path: '**', redirectTo: '/student/tests' },
];

@NgModule({
  declarations: [TestsComponent, TestAttemptComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgZorroAntdModule,
    IconsProviderModule,
    FormsModule,
  ],
})
export class TestsModule {}
