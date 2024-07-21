import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/admin/home' },
  {
    path: '',
    component: AdminComponent,
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
        path: 'students',
        loadChildren: () =>
          import('./students/students.module').then(
            (m) => m.StudentsModule
          ),
      },
      {
        path: 'batches',
        loadChildren: () =>
          import('./batches/batches.module').then((m) => m.BatchesModule),
      },
      {
        path: 'tests',
        loadChildren: () =>
          import('./tests/tests.module').then((m) => m.TestsModule),
      },
      {
        path: '**',
        redirectTo: '/admin/home',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
