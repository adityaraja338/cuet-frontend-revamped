import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  isCollapsed = false;
  constructor() { }

  toggleSidenav(){
    this.isCollapsed = !this.isCollapsed;
  }
}
