import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestsComponent } from './tests.component';
import { RouterModule, Routes } from '@angular/router';
import { NgZorroAntdModule } from '../../ng-zorro-antd.module';
import { IconsProviderModule } from '../../icons-provider.module';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: TestsComponent },
  // {
  //   path: '',
  //   children: [
  //     {
  //       path: ':subject',
  //       loadChildren: () =>
  //         import('./topics/topics.module').then((m) => m.TopicsModule),
  //     },
  //   ],
  // },
];

@NgModule({
  declarations: [TestsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgZorroAntdModule,
    IconsProviderModule,
  ],
})
export class TestsModule {}
