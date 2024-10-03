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
      this.url = environment.baseUrl + 'student/';
    } else {
      this.url = 'http://localhost:3000/student/';
    }
  }

  refreshAccessToken(data: any) {
    return this.http.post(`${this.url}refresh-token`, data);
  }

  registerAndInitiatePayment(data: any) {
    return this.http.post(`${this.url}register/create-order`, data);
  }

  verifyRegisterPayment(data: any) {
    return this.http.post(`${this.url}register/payment-verify`, data);
  }

  postStudentGoogleLogin(data: any) {
    return this.http.post(`${this.url}auth`, data);
  }

  getMe() {
    return this.http.get(`${this.url}get-me`);
  }

  getBatches() {
    return this.http.get(`${this.url}register/get-batches`);
  }

  getFeatureList() {
    return this.http.get(`${this.url}register/get-features`);
  }

  // Student Dashboard
  getLiveTestsOverview() {
    return this.http.get(`${this.url}get-live-tests-overview`);
  }

  getHomescreenSubjects() {
    return this.http.get(`${this.url}get-homescreen-subjects`);
  }

  getPerformanceCharts() {
    return this.http.get(`${this.url}get-performance-charts`);
  }

  getLeaderboard() {
    return this.http.get(`${this.url}get-leaderboard`);
  }

  // Resources Page
  getSubjects() {
    return this.http.get(`${this.url}get-subjects`);
  }

  getVideoLinks(params?: any) {
    return this.http.get(`${this.url}get-video-links`, {
      params: params,
    });
  }

  getNewspapers(params?: any) {
    return this.http.get(`${this.url}get-newspapers`, {
      params: params,
    });
  }

  getPYQs() {
    return this.http.get(`${this.url}get-pyqs`);
  }

  getTopics(params: any) {
    return this.http.get(`${this.url}get-topics`, {
      params: params,
    });
  }

  getMaterials(params: any) {
    return this.http.get(`${this.url}get-materials`, {
      params: params,
    });
  }

  getTopicTests(params: any) {
    return this.http.get(`${this.url}get-topic-tests`, {
      params: params,
    });
  }

  // Tests
  getRecordedAndMockTests(params?: any) {
    return this.http.get(`${this.url}get-recorded-and-mock-tests`, {
      params: params,
    });
  }

  postStartTest(data: any) {
    return this.http.post(`${this.url}start-test`, data);
  }

  getQuestions(params: any) {
    return this.http.get(`${this.url}get-questions`, {
      params: params,
    });
  }

  postSubmitAnswer(data: any) {
    return this.http.post(`${this.url}submit-answer`, data);
  }

  postSubmitTest(data: any) {
    return this.http.post(`${this.url}submit-test`, data);
  }

  // Performances
  getPerformances(params?: any) {
    return this.http.get(`${this.url}get-performances`, {
      params: params,
    });
  }

  getTestLeaderboard(params: any) {
    return this.http.get(`${this.url}get-test-leaderboard`, {
      params: params,
    });
  }

  // Account Details
  getAccountDetails() {
    return this.http.get(`${this.url}account/get-details`);
  }

  getAccountFeatures() {
    return this.http.get(`${this.url}account/get-features`);
  }

  getAccountBatches() {
    return this.http.get(`${this.url}account/get-batches`);
  }

  putImageUpdate(data: any) {
    return this.http.put(`${this.url}account/update-image`, data);
  }

  enrollInitiatePayment(data: any) {
    return this.http.post(`${this.url}account-enroll/create-order`, data);
  }

  verifyEnrollPayment(data: any) {
    return this.http.post(`${this.url}account-enroll/verify-payment`, data);
  }

  upgradeInitiatePayment() {
    return this.http.post(`${this.url}account-upgrade/create-order`, {});
  }

  verifyUpgradePayment(data: any) {
    return this.http.post(`${this.url}account-upgrade/verify-payment`, data);
  }

  purchaseFeatureInitiatePayment(data: any) {
    return this.http.post(
      `${this.url}account-purchase-feature/create-order`,
      data,
    );
  }

  verifyFeaturePayment(data: any) {
    return this.http.post(
      `${this.url}account-purchase-feature/verify-payment`,
      data,
    );
  }
}
