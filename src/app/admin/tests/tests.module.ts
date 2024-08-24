import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestsComponent } from './tests.component';
import { RouterModule, Routes } from '@angular/router';
import { NgZorroAntdModule } from '../../ng-zorro-antd.module';
import { IconsProviderModule } from '../../icons-provider.module';
import { AddEditTestComponent } from './add-edit-test/add-edit-test.component';
import { TestDetailComponent } from './test-detail/test-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: TestsComponent },
  { path: 'create', pathMatch: 'full', component: AddEditTestComponent },
  {
    path: 'edit-live/:testId',
    pathMatch: 'full',
    component: AddEditTestComponent,
  },
  {
    path: 'edit-mock/:testId',
    pathMatch: 'full',
    component: AddEditTestComponent,
  },
  {
    path: 'edit-topic/:testId',
    pathMatch: 'full',
    component: AddEditTestComponent,
  },
  { path: 'live/:testId', pathMatch: 'full', component: TestDetailComponent },
  { path: 'mock/:testId', pathMatch: 'full', component: TestDetailComponent },
  { path: 'topic/:testId', pathMatch: 'full', component: TestDetailComponent },
  { path: '**', redirectTo: '/admin/tests' },
];

@NgModule({
  declarations: [TestsComponent, AddEditTestComponent, TestDetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgZorroAntdModule,
    IconsProviderModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class TestsModule {}
