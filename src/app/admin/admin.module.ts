import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { NgZorroAntdModule } from '../ng-zorro-antd.module';
import {SimplebarAngularModule} from "simplebar-angular";



@NgModule({
  declarations: [AdminComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    NgZorroAntdModule,
    SimplebarAngularModule,
  ],
})
export class AdminModule {}
