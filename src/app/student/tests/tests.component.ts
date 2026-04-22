import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpService } from '../../shared/services/http.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subject, debounceTime, takeUntil } from 'rxjs';

export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'loaded'; data: T }
  | { status: 'error'; message: string };

@Component({
  standalone: false,
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrl: './tests.component.scss',
})
export class TestsComponent implements OnInit, OnDestroy {
  readonly debounceTimeMs = 400;

  recordedTestsState: AsyncState<any[]> = { status: 'idle' };
  mockTestsState: AsyncState<any[]> = { status: 'idle' };
  topicTestsState: AsyncState<any[]> = { status: 'idle' };

  currentTabIndex = 0;

  isInvalidModal = false;
  isStartTestModal = false;
  selectedTest: any;
  selectedTestType: any;

  isPendingTest = false;
  pendingTestDetails: any;

  topicCount = 0;
  topicIndex: number = 1;
  topicLimit: number = 10;
  topicSearch: string = '';
  topicSubject = new BehaviorSubject<string>('');
  topicIdFilter!: number;

  topicsIndex: number = 1;
  topics: any[] = [];
  topicSearchSubject = new BehaviorSubject<string>('');

  private readonly destroy$ = new Subject<void>();

  constructor(
    private http: HttpService,
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.getRecordedAndMockTests();
    this.getTopicTests();

    this.topicSubject
      .pipe(debounceTime(this.debounceTimeMs), takeUntil(this.destroy$))
      .subscribe((searchValue: string) => {
        this.topicSearch = searchValue;
        this.topicIndex = 1;
        this.getTopicTests();
      });

    this.topicSearchSubject
      .pipe(debounceTime(this.debounceTimeMs), takeUntil(this.destroy$))
      .subscribe((searchValue: string) => {
        this.topicsIndex = 1;
        this.topics = [];
        this.getAllTopics(searchValue);
      });

    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getRecordedAndMockTests() {
    this.recordedTestsState = { status: 'loading' };
    this.mockTestsState = { status: 'loading' };
    this.http.getRecordedAndMockTests().subscribe({
      next: (res: any) => {
        this.recordedTestsState = {
          status: 'loaded',
          data: res?.data?.recordedTests ?? [],
        };
        this.mockTestsState = {
          status: 'loaded',
          data: res?.data?.mockTests ?? [],
        };
      },
      error: (error: any) => {
        console.log(error);
        const msg = error?.error?.message ?? 'Failed to load tests';
        this.recordedTestsState = { status: 'error', message: msg };
        this.mockTestsState = { status: 'error', message: msg };
        this.message.error(msg);
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

    this.topicTestsState = { status: 'loading' };
    this.http.getAllTopicTests(data).subscribe({
      next: (res: any) => {
        this.topicTestsState = {
          status: 'loaded',
          data: res?.data?.topicTests ?? [],
        };
        this.topicCount = res?.data?.total ?? 0;
      },
      error: (error: any) => {
        console.log(error);
        const msg = error?.error?.message ?? 'Failed to load topic tests';
        this.topicTestsState = { status: 'error', message: msg };
        this.message.error(msg);
      },
    });
  }

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
      queryParamsHandling: 'merge',
    });
  }

  onModalClose() {
    this.selectedTest = undefined;
    this.isStartTestModal = false;
    this.isInvalidModal = false;
    this.isPendingTest = false;
    this.pendingTestDetails = undefined;
  }

  // ── Derived getters for template compatibility ──────────────────────────

  get recordedTests(): any[] {
    return this.recordedTestsState.status === 'loaded'
      ? this.recordedTestsState.data
      : [];
  }

  get mockTests(): any[] {
    return this.mockTestsState.status === 'loaded'
      ? this.mockTestsState.data
      : [];
  }

  get topicTests(): any[] {
    return this.topicTestsState.status === 'loaded'
      ? this.topicTestsState.data
      : [];
  }

  get isRecordedLoading(): boolean {
    return this.recordedTestsState.status === 'loading';
  }
  get isRecordedError(): boolean {
    return this.recordedTestsState.status === 'error';
  }
  get isRecordedEmpty(): boolean {
    return (
      this.recordedTestsState.status === 'loaded' &&
      this.recordedTestsState.data.length === 0
    );
  }

  get isMockLoading(): boolean {
    return this.mockTestsState.status === 'loading';
  }
  get isMockError(): boolean {
    return this.mockTestsState.status === 'error';
  }
  get isMockEmpty(): boolean {
    return (
      this.mockTestsState.status === 'loaded' &&
      this.mockTestsState.data.length === 0
    );
  }

  get isTopicLoading(): boolean {
    return this.topicTestsState.status === 'loading';
  }
  get isTopicError(): boolean {
    return this.topicTestsState.status === 'error';
  }
  get isTopicEmpty(): boolean {
    return (
      this.topicTestsState.status === 'loaded' &&
      this.topicTestsState.data.length === 0
    );
  }

  protected readonly Math = Math;
}
