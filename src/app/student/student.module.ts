import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentComponent } from './student.component';
import { NgZorroAntdModule } from '../ng-zorro-antd.module';
import { StudentRoutingModule } from './student-routing.module';
import { SimplebarAngularModule } from 'simplebar-angular';

@NgModule({
  declarations: [StudentComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    StudentRoutingModule,
    SimplebarAngularModule,
  ],
})
export class StudentModule {}
