import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  domain: any = typeof window !== 'undefined' ? window.location.hostname : '';
  url: any;

  constructor(private readonly http: HttpClient) {
    this.getUrl();
  }

  getUrl() {
    this.url = environment.baseUrl + 'student/';

    // console.log('this.url', this.domain);
    // console.log('this.url', this.url);
  }

  getApi(path: string, params: any = {}) {
    return this.http.get(`${this.url}${path}`, { params: params });
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

  getUserNotifications() {
    return this.http.get(`${this.url}get-user-notifications`, {});
  }

  getUserEvents() {
    return this.http.get(`${this.url}get-user-events`, {});
  }

  checkUnfinishedTest() {
    return this.http.get(`${this.url}check-unfinished-tests`);
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

  postLogAccess(data: any) {
    return this.http.post(`${this.url}log-access`, data);
  }

  // Tests
  getRecordedAndMockTests(params?: any) {
    return this.http.get(`${this.url}get-recorded-and-mock-tests`, {
      params: params,
    });
  }

  getAllTopicTests(params?: any) {
    return this.http.get(`${this.url}get-all-topic-tests`, { params: params });
  }

  getAllTopics(params?: any) {
    return this.http.get(`${this.url}get-all-topics`, { params: params });
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
