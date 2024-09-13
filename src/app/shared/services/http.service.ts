import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  url: any = new URL(window.location.href);

  constructor(private readonly http: HttpClient) {
    this.getUrl();
  }

  getUrl() {
    if (this.url == 'https://www.cuetcorner.in') {
      this.url = environment.baseUrl;
    } else {
      this.url = 'http://localhost:3000';
    }
  }

  // httpCallFn(){
  //   this.http.getLiveTestsOverview().subscribe({
  //     next: (res: any) => {},
  //     error: (error: any) => {
  //       console.log(error);
  //       this.message.error(error?.error?.message);
  //     },
  //   })
  // }

  registerAndInitiatePayment(data: any) {
    return this.http.post(`${this.url}/student/register/create-order`, data);
  }

  verifyRegisterPayment(data: any) {
    return this.http.post(`${this.url}/student/register/payment-verify`, data);
  }

  postStudentGoogleLogin(data: any) {
    return this.http.post(`${this.url}/student/auth`, data);
  }

  postAdminLogin(data: any) {
    return this.http.post(`${this.url}/admin/auth`, data);
  }

  getLastTestDate() {
    return this.http.get(`${this.url}/admin/get-last-live-test`);
  }

  getBestAndWorstStudents() {
    return this.http.get(`${this.url}/admin/get-best-and-worst-students`);
  }

  // Student Dashboard
  getLiveTestsOverview() {
    return this.http.get(`${this.url}/student/get-live-tests-overview`);
  }

  getHomescreenSubjects() {
    return this.http.get(`${this.url}/student/get-homescreen-subjects`);
  }

  getPerformanceCharts() {
    return this.http.get(`${this.url}/student/get-performance-charts`);
  }

  getLeaderboard() {
    return this.http.get(`${this.url}/student/get-leaderboard`);
  }

  // Account Details
  getAccountDetails() {
    return this.http.get(`${this.url}/student/get-account-details`);
  }

  putImageUpdate(data: any) {
    return this.http.put(`${this.url}/student/account/update-image`, data);
  }
}
