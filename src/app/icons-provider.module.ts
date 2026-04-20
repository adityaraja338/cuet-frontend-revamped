import { NgModule } from '@angular/core';
import { NZ_ICONS, NzIconModule } from 'ng-zorro-antd/icon';

import {
  MenuFoldOutline,
  MenuUnfoldOutline,
  FormOutline,
  DashboardOutline,
  PlusOutline,
  ArrowRightOutline,
  ReadOutline,
  BankOutline,
  FileDoneOutline,
  PlaySquareOutline,
  BookOutline,
  BulbOutline,
  RiseOutline,
  CheckCircleOutline,
} from '@ant-design/icons-angular/icons';

const icons = [
  MenuFoldOutline,
  MenuUnfoldOutline,
  DashboardOutline,
  FormOutline,
  PlusOutline,
  ArrowRightOutline,
  ReadOutline,
  BankOutline,
  FileDoneOutline,
  PlaySquareOutline,
  BookOutline,
  BulbOutline,
  RiseOutline,
  CheckCircleOutline,
];

@NgModule({
  imports: [NzIconModule.forRoot(icons)],
  exports: [NzIconModule],
  providers: [{ provide: NZ_ICONS, useValue: icons }],
})
export class IconsProviderModule {}
