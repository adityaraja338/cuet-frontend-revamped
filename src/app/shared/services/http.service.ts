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

  getLastTestDate() {
    return this.http.get(`${this.url}/admin/get-last-live-test`);
  }

  getBestAndWorstStudents() {
    return this.http.get(`${this.url}/admin/get-best-and-worst-students`);
  }
}
