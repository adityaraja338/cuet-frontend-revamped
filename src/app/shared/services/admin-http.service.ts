import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class AdminHttpService {
  url: any = new URL(window.location.href);

  constructor(private readonly http: HttpClient) {
    this.getUrl();
  }

  getUrl() {
    if (this.url == 'https://www.cuetcorner.in') {
      this.url = environment.baseUrl + 'admin/';
    } else {
      this.url = 'http://localhost:3000/admin/';
    }
  }

  postAdminLogin(data: any) {
    return this.http.post(`${this.url}auth`, data);
  }

  // Dashboard APIs
  getLastTestDate() {
    return this.http.get(`${this.url}get-last-live-test`);
  }

  getBestAndWorstStudents() {
    return this.http.get(`${this.url}get-best-and-worst-students`);
  }

  getOverallPerformance() {
    return this.http.get(`${this.url}get-good-bad-percentage-students`);
  }

  getBestAndWorstBatch() {
    return this.http.get(`${this.url}get-best-and-worst-batch`);
  }

  getCountMetrics() {
    return this.http.get(`${this.url}get-count-metrics`);
  }

  getRefreshLeaderboard() {
    return this.http.get(`${this.url}refresh-leaderboard`);
  }

  // Batches APIs
  getBatches(params?: any) {
    return this.http.get(`${this.url}get-batches`, {
      params: params,
    });
  }

  getBatchInfo(params: any) {
    return this.http.get(`${this.url}get-batch-info`, {
      params: params,
    });
  }

  putChangeEntry(data: any) {
    return this.http.put(`${this.url}change-batch-entry`, data);
  }

  postCreateBatch(data: any) {
    return this.http.post(`${this.url}create-batch`, data);
  }

  putEditBatch(data: any) {
    return this.http.put(`${this.url}edit-batch-info`, data);
  }

  deleteBatch(params: any) {
    return this.http.delete(`${this.url}delete-batch`, { params: params });
  }

  getBatchDetails(params: any) {
    return this.http.get(`${this.url}get-batch-details`, {
      params: params,
    });
  }

  // Students APIs
  getStudents(params?: any) {
    return this.http.get(`${this.url}get-students`, {
      params: params,
    });
  }

  putEditStudentBatch(data: any) {
    return this.http.put(`${this.url}edit-student-batch`, data);
  }

  putEditStudent(data: any) {
    return this.http.put(`${this.url}edit-student`, data);
  }

  deleteStudentBatch(params: any) {
    return this.http.delete(`${this.url}delete-student-batch`, {
      params: params,
    });
  }

  deleteStudent(params: any) {
    return this.http.delete(`${this.url}delete-student`, {
      params: params,
    });
  }

  // Get List APIs
  getFeaturesList(params?: any) {
    return this.http.get(`${this.url}get-feature-list`, {
      params: params,
    });
  }

  getBatchList(params?: any) {
    return this.http.get(`${this.url}get-batch-list`, {
      params: params,
    });
  }
}
