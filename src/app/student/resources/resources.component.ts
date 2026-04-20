import { Component, OnDestroy, OnInit } from '@angular/core';

export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'loaded'; data: T }
  | { status: 'error'; message: string };
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../shared/services/http.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject, debounceTime, takeUntil, forkJoin, finalize } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.scss',
})
export class ResourcesComponent implements OnInit, OnDestroy {
  readonly debounceTimeMs = 400;

  nonDomainSubjects: any[] = [];
  domainSubjects: any[] = [];
  videoLinks: any[] = [];
  newspapers: any[] = [];
  pyqs: any[] = [];

  // Subjects -> Topics (inline, no forced navigation)
  selectedSubjectId: number | null = null;
  selectedSubjectName: string | null = null;
  subjectTopics: any[] = [];
  isTopicsLoading = false;
  isSubjectsLoading = false;
  isVideosLoading = false;
  isNewspapersLoading = false;
  isPYQsLoading = false;

  // Topic -> Materials + Tests (inline)
  selectedTopicId: number | null = null;
  selectedTopicName: string | null = null;
  selectedTopicChapterName: string | null = null;

  isTopicDetailsLoading = false;
  topicMaterials: any[] = [];

  searchTopicTest = '';
  topicTests: any[] = [];
  topicTestsPageIndex = 1;
  topicTestsPageSize = 10;
  totalTopicTests = 0;

  searchNewspaper: string = '';
  searchNewspaperSubject = new Subject<string>();
  searchNewspaperDate: any;
  totalNewspaper: number = 0;
  newspaperPageIndex: number = 1;
  newspaperPageSize: number = 30;

  searchVideo: string = '';
  searchVideoSubject = new Subject<string>();
  totalVideos: number = 0;
  videosPageIndex: number = 1;
  videosPageSize: number = 30;

  isInvalidModal: boolean = false;
  isStartTestModal = false;
  selectedTest: any;
  selectedTestType: any;

  isPendingTest = false;
  pendingTestDetails: any;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private http: HttpService,
    private message: NzMessageService,
  ) {}

  ngOnInit() {
    this.getSubjects();
    this.getVideoLinks();
    this.getNewspapers();
    this.getPYQs();

    this.searchNewspaperSubject
      .pipe(debounceTime(this.debounceTimeMs))
      .pipe(takeUntil(this.destroy$))
      .subscribe((searchValue) => {
        this.searchNewspaper = searchValue;
        this.getNewspapers();
      });

    this.searchVideoSubject
      .pipe(debounceTime(this.debounceTimeMs))
      .pipe(takeUntil(this.destroy$))
      .subscribe((searchValue) => {
        this.searchVideo = searchValue;
        this.getVideoLinks();
      });

    // If route contains a subjectId, load its topics inline (while keeping nested routes as fallback)
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const raw = params.get('subjectId');
      const subjectId = raw ? Number(raw) : null;
      if (subjectId && !Number.isNaN(subjectId)) {
        this.selectSubjectById(subjectId);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getSubjects() {
    this.isSubjectsLoading = true;
    this.http.getSubjects().pipe(finalize(() => this.isSubjectsLoading = false)).subscribe({
      next: (res: any) => {
        this.nonDomainSubjects =
          res?.data?.filter((item: any) => item['isDomain'] === false) ?? [];
        this.domainSubjects =
          res?.data?.filter((item: any) => item['isDomain'] === true) ?? [];

        // Auto-select first subject for better UX on first visit
        if (!this.selectedSubjectId) {
          const first = this.nonDomainSubjects?.[0] ?? this.domainSubjects?.[0];
          if (first?.id) this.selectSubject(first);
        }
      },
      error: (error: any) => {
        console.log(error);
        this.message?.error(error?.error?.message);
      },
    });
  }

  selectSubject(subject: any) {
    const subjectId = Number(subject?.id);
    if (!subjectId || Number.isNaN(subjectId)) return;

    this.selectedSubjectId = subjectId;
    this.selectedSubjectName = subject?.name ?? null;
    this.loadTopicsForSubject(subjectId);
  }

  /**
   * Toggle a subject open/closed in the accordion.
   * Clicking the same subject a second time collapses it.
   */
  toggleSubject(subject: any) {
    const subjectId = Number(subject?.id);
    if (!subjectId || Number.isNaN(subjectId)) return;

    if (this.selectedSubjectId === subjectId) {
      // Collapse
      this.selectedSubjectId = null;
      this.selectedSubjectName = null;
      this.subjectTopics = [];
      this.clearSelectedTopic();
    } else {
      this.selectSubject(subject);
    }
  }

  selectSubjectById(subjectId: number) {
    // If we already have subjects, try to set a name; otherwise just load topics
    const all = [...(this.nonDomainSubjects ?? []), ...(this.domainSubjects ?? [])];
    const found = all.find((s) => Number(s?.id) === Number(subjectId));
    this.selectedSubjectId = subjectId;
    this.selectedSubjectName = found?.name ?? this.selectedSubjectName;
    this.loadTopicsForSubject(subjectId);
  }

  private loadTopicsForSubject(subjectId: number) {
    this.isTopicsLoading = true;
    this.subjectTopics = [];
    this.clearSelectedTopic();

    this.http.getTopics({ subjectId }).subscribe({
      next: (res: any) => {
        this.subjectTopics = res?.data?.topics ?? [];
        this.selectedSubjectName = res?.data?.subjectName ?? this.selectedSubjectName;
        this.isTopicsLoading = false;
      },
      error: (error: any) => {
        console.log(error);
        this.message?.error(error?.error?.message);
        this.isTopicsLoading = false;
      },
    });
  }

  selectTopic(topic: any) {
    const topicId = Number(topic?.id);
    if (!topicId || Number.isNaN(topicId)) return;

    // Toggle off if clicking the same topic again
    if (this.selectedTopicId === topicId) {
      this.clearSelectedTopic();
      return;
    }

    this.selectedTopicId = topicId;
    this.selectedTopicName = topic?.name ?? null;
    this.selectedTopicChapterName =
      topic?.chapter?.name ??
      topic?.chapterName ??
      topic?.chapter_title ??
      topic?.chapterTitle ??
      null;

    this.topicTestsPageIndex = 1;
    this.searchTopicTest = '';
    this.loadTopicDetails();
  }

  private clearSelectedTopic() {
    this.selectedTopicId = null;
    this.selectedTopicName = null;
    this.selectedTopicChapterName = null;
    this.isTopicDetailsLoading = false;
    this.topicMaterials = [];
    this.topicTests = [];
    this.totalTopicTests = 0;
    this.searchTopicTest = '';
    this.topicTestsPageIndex = 1;
    this.onModalClose();
  }

  private loadTopicDetails() {
    if (!this.selectedTopicId) return;
    this.isTopicDetailsLoading = true;
    this.topicMaterials = [];
    this.topicTests = [];
    this.totalTopicTests = 0;

    // Load both in parallel and wait for both to finish before hiding the spinner
    forkJoin({
      materials: this.http.getMaterials({ topicId: this.selectedTopicId }),
      tests: this.http.getTopicTests({
        topicId: this.selectedTopicId,
        page: this.topicTestsPageIndex,
        limit: this.topicTestsPageSize
      })
    })
    .pipe(finalize(() => this.isTopicDetailsLoading = false))
    .subscribe({
      next: (res: any) => {
        // Handle materials
        const matData = res.materials?.data;
        this.topicMaterials = matData?.materials ?? [];
        this.selectedSubjectName = matData?.subjectName ?? this.selectedSubjectName;
        this.selectedSubjectId = matData?.subjectId ?? this.selectedSubjectId;
        this.selectedTopicName = matData?.topicName ?? this.selectedTopicName;

        // Handle tests
        const testData = res.tests?.data;
        this.topicTests = testData?.tests ?? [];
        this.totalTopicTests = testData?.total ?? 0;
      },
      error: (error: any) => {
        console.log(error);
        this.message?.error(error?.error?.message);
      }
    });
  }

  private getTopicMaterials() {
    if (!this.selectedTopicId) return;
    this.http.getMaterials({ topicId: this.selectedTopicId }).subscribe({
      next: (res: any) => {
        this.topicMaterials = res?.data?.materials ?? [];
        this.selectedSubjectName = res?.data?.subjectName ?? this.selectedSubjectName;
        this.selectedSubjectId = res?.data?.subjectId ?? this.selectedSubjectId;
        this.selectedTopicName = res?.data?.topicName ?? this.selectedTopicName;
      },
      error: (error: any) => {
        console.log(error);
        this.message?.error(error?.error?.message);
      },
    });
  }

  getTopicTests(event?: any) {
    if (!this.selectedTopicId) return;

    const data: any = {
      topicId: this.selectedTopicId,
      page: this.topicTestsPageIndex,
      limit: this.topicTestsPageSize,
    };

    if (event) {
      data['page'] = event?.pageIndex;
      data['limit'] = event?.pageSize;
      this.topicTestsPageIndex = event?.pageIndex ?? this.topicTestsPageIndex;
      this.topicTestsPageSize = event?.pageSize ?? this.topicTestsPageSize;

      // When explicitly triggered by pagination, show the spinner
      this.isTopicDetailsLoading = true;
    }

    if (this.searchTopicTest) {
      data['search'] = this.searchTopicTest;
    }

    this.http.getTopicTests(data).pipe(finalize(() => this.isTopicDetailsLoading = false)).subscribe({
      next: (res: any) => {
        this.topicTests = res?.data?.tests ?? [];
        this.totalTopicTests = res?.data?.total ?? 0;
      },
      error: (error: any) => {
        console.log(error);
        this.message?.error(error?.error?.message);
      },
    });
  }

  onReadMaterial(id: number) {
    this.http.postLogAccess({ itemId: id, itemType: 'material' }).subscribe({
      next: () => {
        // Nothing to do
      },
      error: (error: any) => {
        console.log(error);
        this.message?.error(error?.error?.message);
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
        this.message?.error(error?.error?.message);
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
      next: () => {
        this.message.success('Successful! Test submitted!');
        this.onModalClose();
      },
      error: (error: any) => {
        console.log(error);
        this.message?.error(error?.error?.message);
      },
    });
  }

  onModalClose() {
    this.selectedTest = undefined;
    this.selectedTestType = undefined;
    this.isStartTestModal = false;
    this.isInvalidModal = false;
    this.isPendingTest = false;
    this.pendingTestDetails = undefined;
  }

  get topicGroups(): Array<{ title: string; topics: any[] }> {
    const items = this.subjectTopics ?? [];
    const groups = new Map<string, any[]>();

    for (const t of items) {
      const title =
        t?.chapter?.name ??
        t?.chapterName ??
        t?.chapter_title ??
        t?.chapterTitle ??
        'Topics';
      const list = groups.get(title) ?? [];
      list.push(t);
      groups.set(title, list);
    }

    return Array.from(groups.entries()).map(([title, topics]) => ({ title, topics }));
  }

  getVideoLinks(event?: any) {
    const data: any = {
      page: this.videosPageIndex,
      limit: this.videosPageSize,
    };

    if (event) {
      data['page'] = event.pageIndex;
      data['limit'] = event.pageSize;
    }

    if (this.searchVideo) {
      data['search'] = this.searchVideo;
    }

    this.isVideosLoading = true;
    this.http.getVideoLinks(data).pipe(finalize(() => this.isVideosLoading = false)).subscribe({
      next: (res: any) => {
        // Temporary Mock Data for UI Work
        this.videoLinks = [
          { id: 101, name: 'CUET UG General Test - Comprehensive Strategy & Practice', url: 'https://youtube.com/watch?v=dQw4w9WgXcQ', subject: 'General Test', length: 145, isFree: true },
          { id: 102, name: 'Quantitative Aptitude Masterclass: Number Systems', url: 'https://youtube.com/watch?v=dQw4w9WgXcQ', subject: 'Mathematics', length: 85, isFree: true },
          { id: 103, name: 'Logical Reasoning Mock Test Analysis (Locked)', url: null, subject: 'Logical Reasoning', length: 120, isFree: false },
          { id: 104, name: 'Physics Chapter 1: Electric Charges and Fields', url: 'https://youtube.com/watch?v=dQw4w9WgXcQ', subject: 'Physics', length: 55, isFree: false }
        ];
        this.totalVideos = 4;
      },
      error: (error: any) => {
        console.log(error);
        this.message?.error(error?.error?.message);
      },
    });
  }

  onSearchVideoLinks(searchValue: string) {
    this.searchVideoSubject.next(searchValue);
  }

  getNewspapers(event?: any) {
    const data: any = {
      page: this.newspaperPageIndex,
      limit: this.newspaperPageSize,
    };

    if (event) {
      data['page'] = event.pageIndex;
      data['limit'] = event.pageSize;
    }

    if (this.searchNewspaper) {
      data['search'] = this.searchNewspaper;
    }

    if (this.searchNewspaperDate) {
      const date = this.searchNewspaperDate;
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const day = String(date.getDate()).padStart(2, '0');
      data['date'] = `${year}-${month}-${day}`;
    }

    this.isNewspapersLoading = true;
    this.http.getNewspapers(data).pipe(finalize(() => this.isNewspapersLoading = false)).subscribe({
      next: (res: any) => {
        this.newspapers = res?.data?.newspapers ?? [];
        this.totalNewspaper = res?.data?.total ?? 0;
      },
      error: (error: any) => {
        console.log(error);
        this.message?.error(error?.error?.message);
      },
    });
  }

  onSearchNewspaper(searchValue: string) {
    this.searchNewspaperSubject.next(searchValue);
  }

  getPYQs() {
    this.isPYQsLoading = true;
    this.http.getPYQs().pipe(finalize(() => this.isPYQsLoading = false)).subscribe({
      next: (res: any) => {
        this.pyqs = res?.data ?? [];
      },
      error: (error: any) => {
        console.log(error);
        this.message?.error(error?.error?.message);
      },
    });
  }

  onClickSubject(subjectId: number) {
    // Keep nested route available, but current redesign prefers inline rendering.
    this.router.navigate(['/student/resources', subjectId]);
  }

  onViewVideo(id: number) {
    this.http.postLogAccess({ itemId: id, itemType: 'video' }).subscribe({
      next: (res: any) => {
        // Nothing to do
      },
      error: (error: any) => {
        console.log(error);
        this.message?.error(error?.error?.message);
      },
    });
  }

  protected readonly Math = Math;
}
