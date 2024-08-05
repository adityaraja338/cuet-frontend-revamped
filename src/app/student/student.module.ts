import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentComponent } from './student.component';
import { NgZorroAntdModule } from '../ng-zorro-antd.module';
import { StudentRoutingModule } from './student-routing.module';

@NgModule({
  declarations: [StudentComponent],
  imports: [CommonModule, NgZorroAntdModule, StudentRoutingModule],
})
export class StudentModule {}
