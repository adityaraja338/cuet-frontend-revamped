import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentComponent } from './student.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/student/home' },
  {
    path: '',
    component: StudentComponent,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'resources',
        loadChildren: () =>
          import('./resources/resources.module').then((m) => m.ResourcesModule),
      },
      {
        path: 'tests',
        loadChildren: () =>
          import('./tests/tests.module').then((m) => m.TestsModule),
      },
      {
        path: 'performances',
        loadChildren: () =>
          import('./performances/performances.module').then(
            (m) => m.PerformancesModule,
          ),
      },
      {
        path: 'account',
        loadChildren: () =>
          import('./account/account.module').then((m) => m.AccountModule),
      },
      {
        path: '**',
        redirectTo: '/student/home',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentRoutingModule {}
