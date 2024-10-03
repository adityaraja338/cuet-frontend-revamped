import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminHttpService } from '../../../shared/services/admin-http.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { GlobalService } from '../../../shared/services/global.service';

@Component({
  selector: 'app-test-detail',
  templateUrl: './test-detail.component.html',
  styleUrl: './test-detail.component.scss',
})
export class TestDetailComponent implements OnInit {
  isRecorded = false;
  isRankList: boolean = false;

  testId: any;
  testType: any;

  isLoading = false;
  testDetails: any;
  participants: any;
  recordedParticipants: any;
  leaderboard: any;

  isQuestionLoading = false;
  isQuestionViewModal = false;
  questions: any;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly http: AdminHttpService,
    private readonly message: NzMessageService,
    protected readonly globalService: GlobalService,
  ) {}

  ngOnInit() {
    this.testId = +this.route.snapshot.params['testId'];
    const url = this.router.url.split('/');
    this.testType = url[url.length - 2];

    if (
      isNaN(this.testId) ||
      !['live', 'mock', 'topic'].includes(this.testType)
    ) {
      this.message.error('Error! Invalid test!');
    } else {
      this.getTestDetails();
      if (this.testType === 'live') {
        this.getTestRecordedParticipants();
      }
    }
  }

  getTestDetails() {
    this.isLoading = true;
    const data: any = {
      testId: this.testId,
      testType: this.testType,
    };

    this.http.getTestDetails(data).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.testDetails = res?.data?.testDetails;
        this.participants = res?.data?.participants;
      },
      error: (error: any) => {
        this.isLoading = false;
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  getTestRecordedParticipants() {
    this.isLoading = true;
    const data: any = {
      testId: this.testId,
    };

    this.http.getTestRecordedParticipants(data).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.recordedParticipants = res?.data?.participants;
      },
      error: (error: any) => {
        this.isLoading = false;
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  onRankModeChange() {
    if (this.isRankList) {
      this.testType === 'live' && this.isRecorded
        ? this.getTestLeaderboard('recorded')
        : this.getTestLeaderboard('live');
    }
  }

  getTestLeaderboard(testType: string) {
    this.isLoading = true;
    const data: any = {
      testId: this.testId,
      testType,
    };

    this.http.getTestLeaderboard(data).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.leaderboard = res?.data;
      },
      error: (error: any) => {
        this.isLoading = false;
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  getTestQuestions() {
    if (!this.questions) {
      this.isQuestionLoading = true;
      const data: any = {
        testId: this.testId,
        testType: this.testType,
      };

      this.http.getTestQuestions(data).subscribe({
        next: (res: any) => {
          this.isQuestionLoading = false;
          this.questions = res?.data?.questions;
        },
        error: (error: any) => {
          this.isQuestionLoading = false;
          console.log(error);
          this.message.error(error?.error?.message);
        },
      });
    }
  }

  onModalOpen() {
    this.getTestQuestions();
    this.isQuestionViewModal = true;
  }

  onModalClose() {
    this.isQuestionViewModal = false;
  }

  protected readonly Math = Math;
}
