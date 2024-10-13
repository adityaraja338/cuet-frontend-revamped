import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsAndNotificationsComponent } from './events-and-notifications.component';
import { NgZorroAntdModule } from '../../ng-zorro-antd.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: EventsAndNotificationsComponent },
  { path: '**', redirectTo: '/admin/events-and-notifications' },
];

@NgModule({
  declarations: [EventsAndNotificationsComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
})
export class EventsAndNotificationsModule {}
