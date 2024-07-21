import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: '**', redirectTo: '/student/home'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  declarations: [DashboardComponent],
  exports: [DashboardComponent]
})
export class DashboardModule {}
