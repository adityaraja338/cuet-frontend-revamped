import { NgModule } from '@angular/core';
import { PerformancesComponent } from './performances.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: PerformancesComponent },
  { path: '**', redirectTo: '/student/performances' },
];

@NgModule({
  declarations: [PerformancesComponent],
  imports: [RouterModule.forChild(routes)],
  exports: [PerformancesComponent],
})
export class PerformancesModule {}
