import { Component } from '@angular/core';
import { GlobalService } from './shared/services/global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // isCollapsed = false;
  constructor(protected globalService: GlobalService){}
}
