import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  isCollapsed = false;
  isRegistrationPage: boolean = false;
  private dataSubject = new BehaviorSubject<any>(null);

  // Expose the data as an Observable
  data$ = this.dataSubject.asObservable();

  constructor(private http: HttpService) {}

  toggleSidenav() {
    this.isCollapsed = !this.isCollapsed;
  }

  getMe() {
    console.log('get me called');
  }

  // Call this method when new data is received
  setData(newData: any): void {
    this.dataSubject.next(newData);
  }

  toggleRegistrationPage() {
    this.isRegistrationPage = !this.isRegistrationPage;
  }
}
