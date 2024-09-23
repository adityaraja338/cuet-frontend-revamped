import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminHttpService } from '../../shared/services/admin-http.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrl: './tests.component.scss',
})
export class TestsComponent implements OnInit {
  subjects: any;
  topics: any;
  batches: any;

  collapseFilter: boolean = false;
  liveTests: any;
  totalLiveTestCount = 6;
  livePageIndex = 1;
  livePageSize = 30;
  liveSearch = '';
  liveSearchBatch: number | undefined;
  selectLiveType = 'all';
  isLiveLoading = false;

  mockTests: any;
  totalMockTestCount = 6;
  mockPageIndex = 1;
  mockPageSize = 30;
  mockSearch = '';
  selectMockType = 'all';
  isMockLoading = false;

  topicTests: any;
  totalTopicTestCount = 6;
  topicPageIndex = 1;
  topicPageSize = 30;
  topicSearch = '';
  topicSearchSubject: any;
  topicSearchTopic: any;
  selectTopicType = 'all';
  isTopicLoading = false;

  constructor(
    private readonly router: Router,
    private readonly http: AdminHttpService,
    private readonly message: NzMessageService,
  ) {}

  ngOnInit() {
    this.getLiveTests();
    this.getMockTests();
    this.getTopicTests();
    this.getSubjectList();
    this.getTopicList();
    this.getBatchList();
  }

  getLiveTests(event?: any) {
    this.isLiveLoading = true;
    const data: any = {
      page: this.livePageIndex,
      limit: this.livePageSize,
    };

    if (event) {
      data['page'] = event?.pageIndex;
      data['limit'] = event?.pageSize;
      this.livePageIndex = event?.pageIndex;
      this.livePageSize = event?.pageSize;
    }

    if (this.liveSearch) {
      data['search'] = this.liveSearch;
    }

    if (this.liveSearchBatch) {
      data['batchId'] = this.liveSearchBatch;
    }

    this.selectLiveType ? (data['type'] = this.selectLiveType) : null;

    this.http.getLiveTests(data).subscribe({
      next: (res: any) => {
        this.isLiveLoading = false;
        this.liveTests = res?.data?.tests;
        this.totalLiveTestCount = res?.data?.total;
      },
      error: (error: any) => {
        this.isLiveLoading = false;
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  getMockTests(event?: any) {
    this.isMockLoading = true;
    const data: any = {
      page: this.mockPageIndex,
      limit: this.mockPageSize,
    };

    if (event) {
      data['page'] = event?.pageIndex;
      data['limit'] = event?.pageSize;
      this.mockPageIndex = event?.pageIndex;
      this.mockPageSize = event?.pageSize;
    }

    if (this.mockSearch) {
      data['search'] = this.mockSearch;
    }

    this.selectMockType ? (data['type'] = this.selectMockType) : null;

    this.http.getMockTests(data).subscribe({
      next: (res: any) => {
        this.isMockLoading = false;
        this.mockTests = res?.data?.tests;
        this.totalMockTestCount = res?.data?.total;
      },
      error: (error: any) => {
        this.isMockLoading = false;
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  getTopicTests(event?: any) {
    this.isTopicLoading = true;
    const data: any = {
      page: this.topicPageIndex,
      limit: this.topicPageSize,
    };

    if (event) {
      data['page'] = event?.pageIndex;
      data['limit'] = event?.pageSize;
      this.topicPageIndex = event?.pageIndex;
      this.topicPageSize = event?.pageSize;
    }

    if (this.topicSearch) {
      data['search'] = this.topicSearch;
    }

    if (this.topicSearchSubject) {
      data['subjectId'] = this.topicSearchSubject;
    }

    if (this.topicSearchTopic) {
      data['topicId'] = this.topicSearchTopic;
    }

    this.selectTopicType ? (data['type'] = this.selectTopicType) : null;

    this.http.getTopicTests(data).subscribe({
      next: (res: any) => {
        this.isTopicLoading = false;
        this.topicTests = res?.data?.tests;
        this.totalTopicTestCount = res?.data?.total;
      },
      error: (error: any) => {
        this.isTopicLoading = false;
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  getSubjectList() {
    this.http.getSubjectList().subscribe({
      next: (res: any) => {
        this.subjects = res?.data;
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  getTopicList() {
    this.http.getTopicList().subscribe({
      next: (res: any) => {
        this.topics = res?.data;
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  getBatchList() {
    this.http.getBatchList().subscribe({
      next: (res: any) => {
        this.batches = res?.data;
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  onChangeType(testId: number, testType: string, mode?: string) {
    const data: any = {};
    data['testId'] = testId;
    data['testType'] = testType;
    mode ? (data['mode'] = mode) : null;

    this.http.putChangeTestType(data).subscribe({
      next: (res: any) => {
        this.message.success('Successful! Test type updated!');
        if (testType === 'live') {
          this.getLiveTests();
        } else if (testType === 'mock') {
          this.getMockTests();
        } else {
          this.getTopicTests();
        }
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  onDeleteTest(testId: number, testType: string) {
    const data: any = {};
    data['testId'] = testId;
    data['testType'] = testType;

    this.http.deleteTest(data).subscribe({
      next: (res: any) => {
        this.message.success('Successful! Test deleted!');
        if (testType === 'live') {
          this.getLiveTests();
        } else if (testType === 'mock') {
          this.getMockTests();
        } else {
          this.getTopicTests();
        }
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  onClickTest(event: any, testType: string, testId: number) {
    const excludedSection = (event.target as HTMLElement).closest(
      '.dropdown-container',
    );

    if (excludedSection) {
      // Do nothing if the click was on the excluded section
      return;
    }

    this.router.navigate([this.router.url, testType, testId]);
  }

  protected readonly Math = Math;
}
