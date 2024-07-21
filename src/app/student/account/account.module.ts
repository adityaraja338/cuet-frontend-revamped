import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account.component';

const routes: Routes = [
  { path: '', component: AccountComponent },
  { path: '**', redirectTo: '/student/account' },
];

@NgModule({
  declarations: [AccountComponent],
  imports: [RouterModule.forChild(routes)],
  exports: [AccountComponent],
})
export class AccountModule {}
