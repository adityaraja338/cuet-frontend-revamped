import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account.component';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from '../../ng-zorro-antd.module';

const routes: Routes = [
  { path: '', component: AccountComponent },
  { path: '**', redirectTo: '/student/account' },
];

@NgModule({
  declarations: [AccountComponent],
  imports: [RouterModule.forChild(routes), CommonModule, NgZorroAntdModule],
  exports: [AccountComponent],
})
export class AccountModule {}
