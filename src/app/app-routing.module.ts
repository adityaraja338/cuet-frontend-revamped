import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './shared/components/auth/auth.component';
import { studentAuthGuard } from './shared/guards/student-auth.guard';
import { adminAuthGuard } from './shared/guards/admin-auth.guard';
import { LandingPageComponent } from './shared/components/landing-page/landing-page.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LandingPageComponent,
    data: { animation: 'Landing' },
  },
  { path: 'login', component: AuthComponent, data: { animation: 'Login' } },
  {
    path: 'student',
    loadChildren: () =>
      import('./student/student.module').then((m) => m.StudentModule),
    canActivate: [studentAuthGuard],
    data: { animation: 'Student' },
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
    canActivate: [adminAuthGuard],
    data: { animation: 'Admin' },
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
