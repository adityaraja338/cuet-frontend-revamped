import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from './http.service';
import { AdminHttpService } from './admin-http.service';
import { StudentAuthService } from '../auth/student-auth.service';
import { AdminAuthService } from '../auth/admin-auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  isCollapsed = false;
  isRegistrationPage: boolean = false;
  private dataSubject = new BehaviorSubject<any>(null);

  // Expose the data as an Observable
  data$ = this.dataSubject.asObservable();

  constructor(
    private http: HttpService,
    private adminHttp: AdminHttpService,
    private studentAuthService: StudentAuthService,
    private adminAuthService: AdminAuthService,
    private message: NzMessageService,
  ) {}

  toggleSidenav() {
    this.isCollapsed = !this.isCollapsed;
  }

  userDetails: any;
  getMe() {
    if (this.studentAuthService?.isUserLoggedIn()) {
      this.http.getMe().subscribe({
        next: (res: any) => {
          this.userDetails = res?.data;
          this.setData(this.userDetails);
        },
        error: (error: any) => {
          console.log(error);
          this.message.error(error?.error?.message);
        },
      });
    }

    if (this.adminAuthService?.isUserLoggedIn()) {
      this.adminHttp.getMe().subscribe({
        next: (res: any) => {
          this.userDetails = res?.data;
          this.setData(this.userDetails);
        },
        error: (error: any) => {
          console.log(error);
          this.message.error(error?.error?.message);
        },
      });
    }
  }

  // Call this method when new data is received
  setData(newData: any): void {
    this.dataSubject.next(newData);
  }

  toggleRegistrationPage() {
    this.isRegistrationPage = !this.isRegistrationPage;
  }
}
