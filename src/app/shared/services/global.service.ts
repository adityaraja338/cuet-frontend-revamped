import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  isCollapsed = false;
  constructor() {}

  toggleSidenav() {
    this.isCollapsed = !this.isCollapsed;
  }

  isRegistrationPage: boolean = false;
  private dataSubject = new BehaviorSubject<any>(null);

  // Expose the data as an Observable
  data$ = this.dataSubject.asObservable();

  // Call this method when new data is received
  setData(newData: any): void {
    this.dataSubject.next(newData);
  }

  toggleRegistrationPage() {
    this.isRegistrationPage = !this.isRegistrationPage;
  }
}
