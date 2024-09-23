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

  // Resources APIs
  getSubjects(params: any) {
    return this.http.get(`${this.url}get-subjects`, { params: params });
  }

  postCreateSubject(data: any) {
    return this.http.post(`${this.url}create-subject`, data);
  }

  putEditSubject(data: any) {
    return this.http.put(`${this.url}edit-subject`, data);
  }

  deleteSubject(params: any) {
    return this.http.delete(`${this.url}delete-subject`, { params: params });
  }

  getVideoLinks(params: any) {
    return this.http.get(`${this.url}get-video-links`, { params: params });
  }

  postCreateVideoLink(data: any) {
    return this.http.post(`${this.url}create-video-link`, data);
  }

  putEditVideoLink(data: any) {
    return this.http.put(`${this.url}edit-video-link`, data);
  }

  deleteVideoLink(params: any) {
    return this.http.delete(`${this.url}delete-video-link`, { params: params });
  }

  getPYQs(params: any) {
    return this.http.get(`${this.url}get-pyqs`, { params: params });
  }

  postCreatePYQ(data: any) {
    return this.http.post(`${this.url}create-pyq`, data);
  }

  putEditPYQ(data: any) {
    return this.http.put(`${this.url}edit-pyq`, data);
  }

  deletePYQ(params: any) {
    return this.http.delete(`${this.url}delete-pyq`, { params: params });
  }

  getNewspapers(params: any) {
    return this.http.get(`${this.url}get-newspapers`, { params: params });
  }

  postCreateNewspaper(data: any) {
    return this.http.post(`${this.url}create-newspaper`, data);
  }

  putEditNewspaper(data: any) {
    return this.http.put(`${this.url}edit-newspaper`, data);
  }

  deleteNewspaper(params: any) {
    return this.http.delete(`${this.url}delete-newspaper`, { params: params });
  }

  getTopics(params: any) {
    return this.http.get(`${this.url}get-topics`, { params: params });
  }

  postCreateTopic(data: any) {
    return this.http.post(`${this.url}create-topic`, data);
  }

  putEditTopic(data: any) {
    return this.http.put(`${this.url}edit-topic`, data);
  }

  deleteTopic(params: any) {
    return this.http.delete(`${this.url}delete-topic`, { params: params });
  }

  getMaterials(params: any) {
    return this.http.get(`${this.url}get-materials`, { params: params });
  }

  postCreateMaterial(data: any) {
    return this.http.post(`${this.url}create-material`, data);
  }

  putEditMaterial(data: any) {
    return this.http.put(`${this.url}edit-material`, data);
  }

  deleteMaterial(params: any) {
    return this.http.delete(`${this.url}delete-material`, { params: params });
  }

  // Tests APIs
  getLiveTests(params?: any) {
    return this.http.get(`${this.url}get-live-tests`, {
      params: params,
    });
  }

  getMockTests(params?: any) {
    return this.http.get(`${this.url}get-mock-tests`, {
      params: params,
    });
  }

  getTopicTests(params?: any) {
    return this.http.get(`${this.url}get-topic-tests`, {
      params: params,
    });
  }

  getTestLeaderboard(params: any) {
    return this.http.get(`${this.url}get-student-test-leaderboard`, {
      params: params,
    });
  }

  getTestDetails(params: any) {
    return this.http.get(`${this.url}get-test-details`, { params: params });
  }

  getTestRecordedParticipants(params: any) {
    return this.http.get(`${this.url}get-test-recorded-participants`, {
      params: params,
    });
  }

  getTestQuestions(params: any) {
    return this.http.get(`${this.url}get-test-questions`, { params: params });
  }

  putChangeTestType(data: any) {
    return this.http.put(`${this.url}change-test-type`, data);
  }

  deleteTest(params: any) {
    return this.http.delete(`${this.url}delete-test`, { params: params });
  }

  deleteQuestion(params: any) {
    return this.http.delete(`${this.url}delete-question`, { params: params });
  }

  createQuestion(data: any) {
    return this.http.post(`${this.url}create-question`, data);
  }

  saveQuestion(data: any) {
    return this.http.put(`${this.url}edit-question`, data);
  }

  saveLiveTest(data: any) {
    return this.http.put(`${this.url}edit-live-test`, data);
  }

  saveMockTest(data: any) {
    return this.http.put(`${this.url}edit-mock-test`, data);
  }

  saveTopicTest(data: any) {
    return this.http.put(`${this.url}edit-topic-test`, data);
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

  getStudentDetails(params: any) {
    return this.http.get(`${this.url}get-student-details-and-performances`, {
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

  getSubjectList(params?: any) {
    return this.http.get(`${this.url}get-subject-list`, {
      params: params,
    });
  }

  getTopicList(params?: any) {
    return this.http.get(`${this.url}get-topic-list`, {
      params: params,
    });
  }
}
