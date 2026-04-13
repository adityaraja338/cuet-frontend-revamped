import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../shared/services/http.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, debounceTime } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrl: './tests.component.scss',
})
export class TestsComponent implements OnInit {
  readonly debounceTimeMs = 400;

  recordedTests: any;
  mockTests: any;

  currentTabIndex = 0;

  isInvalidModal = false;
  isStartTestModal = false;
  selectedTest: any;
  selectedTestType: any;

  isPendingTest = false;
  pendingTestDetails: any;

  topicTests: any[] = [];
  topicCount!: number;
  topicIndex: number = 1;
  topicLimit: number = 10;
  topicSearch: string = '';
  topicSubject = new BehaviorSubject<string>('');
  topicIdFilter!: number;

  constructor(
    private http: HttpService,
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.getRecordedAndMockTests();

    this.topicSubject
      .pipe(debounceTime(this.debounceTimeMs))
      .subscribe((searchValue: string) => {
        this.topicSearch = searchValue;
        this.getTopicTests();
      });

    this.topicSearchSubject
      .pipe(debounceTime(this.debounceTimeMs))
      .subscribe((searchValue: string) => {
        this.topicsIndex = 1;
        this.topics = [];
        this.getAllTopics(searchValue);
      });

    this.route.queryParams.subscribe((params) => {
      const tabIndex = params['tab'];
      if (
        tabIndex !== undefined &&
        !isNaN(tabIndex) &&
        tabIndex >= 0 &&
        tabIndex < 3
      ) {
        this.currentTabIndex = Number(tabIndex);
      }
    });
  }

  getRecordedAndMockTests() {
    this.http.getRecordedAndMockTests().subscribe({
      next: (res: any) => {
        this.recordedTests = res?.data?.recordedTests;
        this.mockTests = res?.data?.mockTests;
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  getTopicTests() {
    const data: any = {};

    data.page = this.topicIndex;
    data.limit = this.topicLimit;
    data.search = this.topicSearch;
    if (this.topicIdFilter) {
      data.topicId = this.topicIdFilter;
    }

    this.http.getAllTopicTests(data).subscribe({
      next: (res: any) => {
        this.topicTests = res?.data?.topicTests;
        this.topicCount = res?.data?.total;
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  topicsIndex: number = 1;
  topics: any[] = [];
  topicSearchSubject = new BehaviorSubject<string>('');
  getAllTopics(search?: string) {
    const data: any = {};

    if (search) {
      data.search = search;
    }

    data.page = this.topicsIndex;

    this.http.getAllTopics(data).subscribe({
      next: (res: any) => {
        res?.data?.topics?.forEach((topic: any) => this.topics.push(topic));

        if (res?.data?.topics?.length > 0) {
          this.topicsIndex++;
        }
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  onClickStartTest(test: any, testType: string) {
    this.http.checkUnfinishedTest().subscribe({
      next: (res: any) => {
        // this.notifications = res?.data;
        if (!res?.data) {
          if (!test?.canAttempt) {
            this.isInvalidModal = true;
          } else {
            this.selectedTest = test;
            this.selectedTestType = testType;
            this.isStartTestModal = true;
          }
        } else {
          this.pendingTestDetails = res?.data;
          this.isPendingTest = true;
        }
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error.message);
      },
    });
  }

  submitPendingTest() {
    const data: any = {
      testId: this.pendingTestDetails?.testId,
      testItemId: this.pendingTestDetails?.testItemId,
      testType: this.pendingTestDetails?.testType,
    };

    this.http.postSubmitTest(data).subscribe({
      next: (res: any) => {
        this.message.success('Successful! Test submitted!');
        this.onModalClose();
      },
      error: (error: any) => {
        console.log(error);
        this.message?.error(error?.error?.message);
      },
    });
  }

  onTabChange(index: number): void {
    this.router.navigate([], {
      queryParams: { tab: index },
      queryParamsHandling: 'merge', // Keep the existing query params
    });
  }

  onModalClose() {
    this.selectedTest = undefined;
    this.isStartTestModal = false;
    this.isInvalidModal = false;
    this.isPendingTest = false;
    this.pendingTestDetails = undefined;
  }

  protected readonly Math = Math;
}
