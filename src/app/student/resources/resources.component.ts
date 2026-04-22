import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../shared/services/http.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject, debounceTime, takeUntil } from 'rxjs';

export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'loaded'; data: T }
  | { status: 'error'; message: string };

@Component({
  standalone: false,
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.scss',
})
export class ResourcesComponent implements OnInit, OnDestroy {
  readonly debounceTimeMs = 400;
  readonly pageSizeOptions = [10, 20, 30, 50];

  // ── Subjects + Topics state ──────────────────────────────────────────────
  subjectsState: AsyncState<{ nonDomain: any[]; domain: any[] }> = { status: 'idle' };
  topicsState: AsyncState<any[]> = { status: 'idle' };

  selectedSubjectId: number | null = null;
  selectedSubjectName: string | null = null;
  selectedTopicId: number | null = null;
  selectedTopicName: string | null = null;

  // ── Videos state ────────────────────────────────────────────────────────
  videosState: AsyncState<{ items: any[]; total: number }> = { status: 'idle' };
  videosPageIndex = 1;
  videosPageSize = 30;
  searchVideo = '';
  private readonly searchVideoSubject = new Subject<string>();

  // ── Newspapers state ─────────────────────────────────────────────────────
  newspapersState: AsyncState<{ items: any[]; total: number }> = { status: 'idle' };
  newspaperPageIndex = 1;
  newspaperPageSize = 30;
  searchNewspaper = '';
  searchNewspaperDate: any;
  private readonly searchNewspaperSubject = new Subject<string>();

  // ── PYQs state ───────────────────────────────────────────────────────────
  pyqsState: AsyncState<any[]> = { status: 'idle' };

  // ── Modals ───────────────────────────────────────────────────────────────
  isInvalidModal = false;
  isStartTestModal = false;
  selectedTest: any;
  selectedTestType: any;
  isPendingTest = false;
  pendingTestDetails: any;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly http: HttpService,
    private readonly message: NzMessageService,
  ) {}

  ngOnInit(): void {
    this.getSubjects();
    this.loadMockVideoLinks();
    this.loadMockNewspapers();
    this.loadMockPYQs();

    this.searchNewspaperSubject
      .pipe(debounceTime(this.debounceTimeMs), takeUntil(this.destroy$))
      .subscribe((value) => {
        this.searchNewspaper = value;
        this.getNewspapers();
      });

    this.searchVideoSubject
      .pipe(debounceTime(this.debounceTimeMs), takeUntil(this.destroy$))
      .subscribe((value) => {
        this.searchVideo = value;
        this.getVideoLinks();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Subjects ─────────────────────────────────────────────────────────────

  getSubjects(): void {
    this.subjectsState = { status: 'loading' };
    this.http.getSubjects().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        this.subjectsState = {
          status: 'loaded',
          data: {
            nonDomain: res?.data?.filter((s: any) => s['isDomain'] === false) ?? [],
            domain: res?.data?.filter((s: any) => s['isDomain'] === true) ?? [],
          },
        };
      },
      error: (error: any) => {
        this.subjectsState = { status: 'error', message: error?.error?.message ?? 'Failed to load subjects' };
        this.message?.error(error?.error?.message);
      },
    });
  }

  toggleSubject(subject: any): void {
    const id = Number(subject?.id);
    if (!id || Number.isNaN(id)) return;

    if (this.selectedSubjectId === id) {
      this.selectedSubjectId = null;
      this.selectedSubjectName = null;
      this.topicsState = { status: 'idle' };
      this.clearSelectedTopic();
    } else {
      this.selectedSubjectId = id;
      this.selectedSubjectName = subject?.name ?? null;
      this.clearSelectedTopic();
      this.loadTopicsForSubject(id);
    }
  }

  private loadTopicsForSubject(subjectId: number): void {
    this.topicsState = { status: 'loading' };
    this.http.getTopics({ subjectId }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        const rawTopics: any[] = res?.data?.topics ?? [];
        const topics = rawTopics.filter((t) => this.topicShownInResourcesAccordion(t));
        this.topicsState = { status: 'loaded', data: topics };
        this.selectedSubjectName = res?.data?.subjectName ?? this.selectedSubjectName;
      },
      error: (error: any) => {
        this.topicsState = { status: 'error', message: error?.error?.message ?? 'Failed to load topics' };
        this.message?.error(error?.error?.message);
      },
    });
  }

  private topicShownInResourcesAccordion(topic: any): boolean {
    const id = Number(topic?.id);
    if (!id || Number.isNaN(id)) return false;
    if ((topic?.material ?? 0) > 0) return true;
    // const tt = topic?.topicTest;
    // if (typeof tt === 'number' && Number.isInteger(tt)) {
    //   return tt > 0;
    // }
    return true;
  }

  selectTopic(topic: any): void {
    const id = Number(topic?.id);
    if (!id || Number.isNaN(id)) return;

    if (this.selectedTopicId === id) {
      this.clearSelectedTopic();
      return;
    }

    this.selectedTopicId = id;
    this.selectedTopicName = topic?.name ?? null;
  }

  private clearSelectedTopic(): void {
    this.selectedTopicId = null;
    this.selectedTopicName = null;
    this.onModalClose();
  }

  // ── Derived state getters ─────────────────────────────────────────────

  get isSubjectsLoading(): boolean { return this.subjectsState.status === 'loading'; }
  get nonDomainSubjects(): any[] {
    return this.subjectsState.status === 'loaded' ? this.subjectsState.data.nonDomain : [];
  }
  get domainSubjects(): any[] {
    return this.subjectsState.status === 'loaded' ? this.subjectsState.data.domain : [];
  }

  get isTopicsLoading(): boolean { return this.topicsState.status === 'loading'; }

  get isVideosLoading(): boolean { return this.videosState.status === 'loading'; }
  get videoLinks(): any[] {
    return this.videosState.status === 'loaded' ? this.videosState.data.items : [];
  }
  get totalVideos(): number {
    return this.videosState.status === 'loaded' ? this.videosState.data.total : 0;
  }

  get isNewspapersLoading(): boolean { return this.newspapersState.status === 'loading'; }
  get newspapers(): any[] {
    return this.newspapersState.status === 'loaded' ? this.newspapersState.data.items : [];
  }
  get totalNewspaper(): number {
    return this.newspapersState.status === 'loaded' ? this.newspapersState.data.total : 0;
  }

  get isPYQsLoading(): boolean { return this.pyqsState.status === 'loading'; }
  get pyqs(): any[] {
    return this.pyqsState.status === 'loaded' ? this.pyqsState.data : [];
  }

  get topicGroups(): Array<{ title: string; topics: any[] }> {
    const items = this.topicsState.status === 'loaded' ? this.topicsState.data : [];
    const groups = new Map<string, any[]>();

    for (const t of items) {
      const title =
        t?.chapter?.name ?? t?.chapterName ?? t?.chapter_title ?? t?.chapterTitle ?? 'Topics';
      const list = groups.get(title) ?? [];
      list.push(t);
      groups.set(title, list);
    }

    return Array.from(groups.entries()).map(([title, topics]) => ({ title, topics }));
  }

  // ── Videos ────────────────────────────────────────────────────────────────

  private mockVideoData = [
    {
      id: 1,
      name: 'Introduction to Physics',
      url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
      length: 3600,
      subject: 'Physics',
      isFree: true,
    },
    {
      id: 2,
      name: 'Chemistry Basics - Atomic Structure',
      url: 'https://youtube.com/watch?v=jNQXAC9IVRw',
      length: 4200,
      subject: 'Chemistry',
      isFree: true,
    },
    {
      id: 3,
      name: 'Advanced Organic Chemistry',
      url: null,
      length: 5400,
      subject: 'Chemistry',
      isFree: false,
    },
    {
      id: 4,
      name: 'Biology: Cell Structure and Function',
      url: 'https://youtube.com/watch?v=mQxP-qAWxOI',
      length: 3800,
      subject: 'Biology',
      isFree: true,
    },
    {
      id: 5,
      name: 'Mathematics: Calculus Fundamentals',
      url: null,
      length: 4500,
      subject: 'Mathematics',
      isFree: false,
    },
    {
      id: 6,
      name: 'English Literature: Shakespeare',
      url: 'https://youtube.com/watch?v=9bZkp7q19f0',
      length: 2800,
      subject: 'English',
      isFree: true,
    },
    {
      id: 7,
      name: 'History of India: Medieval Period',
      url: 'https://youtube.com/watch?v=RILEVcWXMF4',
      length: 3600,
      subject: 'History',
      isFree: false,
    },
    {
      id: 8,
      name: 'Geography: World Map and Capitals',
      url: 'https://youtube.com/watch?v=VrDEy_6Zhec',
      length: 2400,
      subject: 'Geography',
      isFree: true,
    },
    {
      id: 9,
      name: 'Economics: Microeconomics Basics',
      url: 'https://youtube.com/watch?v=lIB0aGosFvU',
      length: 3200,
      subject: 'Economics',
      isFree: true,
    },
    {
      id: 10,
      name: 'Political Science: Constitutional Law',
      url: null,
      length: 4800,
      subject: 'Political Science',
      isFree: false,
    },
  ];

  private loadMockVideoLinks(): void {
    setTimeout(() => {
      this.videosState = {
        status: 'loaded',
        data: {
          items: this.mockVideoData.slice(0, this.videosPageSize),
          total: this.mockVideoData.length,
        },
      };
    }, 500);
  }

  getVideoLinks(event?: any): void {
    if (event) {
      this.videosPageIndex = event.pageIndex ?? this.videosPageIndex;
      this.videosPageSize = event.pageSize ?? this.videosPageSize;
    }

    const params: any = { page: this.videosPageIndex, limit: this.videosPageSize };
    if (this.searchVideo) params['search'] = this.searchVideo;

    this.videosState = { status: 'loading' };
    setTimeout(() => {
      let filtered = this.mockVideoData;
      if (this.searchVideo) {
        const term = this.searchVideo.toLowerCase();
        filtered = filtered.filter(v =>
          v.name.toLowerCase().includes(term) ||
          v.subject?.toLowerCase().includes(term)
        );
      }

      const start = (this.videosPageIndex - 1) * this.videosPageSize;
      const end = start + this.videosPageSize;
      this.videosState = {
        status: 'loaded',
        data: {
          items: filtered.slice(start, end),
          total: filtered.length,
        },
      };
    }, 300);
  }

  onSearchVideoLinks(value: string): void {
    this.searchVideoSubject.next(value);
  }

  onViewVideo(id: number): void {
    console.log('Video viewed:', id);
  }

  // ── Newspapers ────────────────────────────────────────────────────────────

  private mockNewspaperData = [
    {
      id: 1,
      name: 'The Times of India',
      url: 'https://timesofindia.indiatimes.com',
      date: new Date(2026, 3, 20),
      isFree: true,
    },
    {
      id: 2,
      name: 'The Hindu',
      url: 'https://thehindu.com',
      date: new Date(2026, 3, 19),
      isFree: true,
    },
    {
      id: 3,
      name: 'India Today',
      url: null,
      date: new Date(2026, 3, 18),
      isFree: false,
    },
    {
      id: 4,
      name: 'The Indian Express',
      url: 'https://indianexpress.com',
      date: new Date(2026, 3, 17),
      isFree: true,
    },
    {
      id: 5,
      name: 'Hindustan Times',
      url: null,
      date: new Date(2026, 3, 16),
      isFree: false,
    },
    {
      id: 6,
      name: 'Deccan Chronicle',
      url: 'https://deccanchronicle.com',
      date: new Date(2026, 3, 15),
      isFree: true,
    },
    {
      id: 7,
      name: 'The Telegraph',
      url: 'https://telegraphindia.com',
      date: new Date(2026, 3, 14),
      isFree: true,
    },
    {
      id: 8,
      name: 'Dainik Jagran',
      url: null,
      date: new Date(2026, 3, 13),
      isFree: false,
    },
    {
      id: 9,
      name: 'DNA India',
      url: 'https://dnaindia.com',
      date: new Date(2026, 3, 12),
      isFree: true,
    },
    {
      id: 10,
      name: 'The Tribune',
      url: 'https://tribuneindia.com',
      date: new Date(2026, 3, 11),
      isFree: true,
    },
  ];

  private loadMockNewspapers(): void {
    setTimeout(() => {
      this.newspapersState = {
        status: 'loaded',
        data: {
          items: this.mockNewspaperData.slice(0, this.newspaperPageSize),
          total: this.mockNewspaperData.length,
        },
      };
    }, 500);
  }

  getNewspapers(event?: any): void {
    if (event) {
      this.newspaperPageIndex = event.pageIndex ?? this.newspaperPageIndex;
      this.newspaperPageSize = event.pageSize ?? this.newspaperPageSize;
    }

    const params: any = { page: this.newspaperPageIndex, limit: this.newspaperPageSize };
    if (this.searchNewspaper) params['search'] = this.searchNewspaper;

    if (this.searchNewspaperDate) {
      const d = this.searchNewspaperDate;
      params['date'] = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    this.newspapersState = { status: 'loading' };
    setTimeout(() => {
      let filtered = this.mockNewspaperData;

      if (this.searchNewspaper) {
        const term = this.searchNewspaper.toLowerCase();
        filtered = filtered.filter(n => n.name.toLowerCase().includes(term));
      }

      if (this.searchNewspaperDate) {
        const d = this.searchNewspaperDate;
        const filterDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        filtered = filtered.filter(n => {
          const nDate = new Date(n.date.getFullYear(), n.date.getMonth(), n.date.getDate());
          return nDate.getTime() === filterDate.getTime();
        });
      }

      const start = (this.newspaperPageIndex - 1) * this.newspaperPageSize;
      const end = start + this.newspaperPageSize;
      this.newspapersState = {
        status: 'loaded',
        data: {
          items: filtered.slice(start, end),
          total: filtered.length,
        },
      };
    }, 300);
  }

  onSearchNewspaper(value: string): void {
    this.searchNewspaperSubject.next(value);
  }

  // ── PYQs ─────────────────────────────────────────────────────────────────

  private mockPYQsData = [
    {
      id: 1,
      name: 'CUET 2024 - Physics (Session 1)',
      url: 'https://example.com/pyq/cuet-2024-physics-1.pdf',
    },
    {
      id: 2,
      name: 'CUET 2024 - Chemistry (Session 1)',
      url: 'https://example.com/pyq/cuet-2024-chemistry-1.pdf',
    },
    {
      id: 3,
      name: 'CUET 2024 - Biology (Session 1)',
      url: null,
    },
    {
      id: 4,
      name: 'CUET 2024 - Mathematics (Session 1)',
      url: 'https://example.com/pyq/cuet-2024-maths-1.pdf',
    },
    {
      id: 5,
      name: 'CUET 2024 - English (Session 1)',
      url: null,
    },
    {
      id: 6,
      name: 'CUET 2023 - Physics (Full Paper)',
      url: 'https://example.com/pyq/cuet-2023-physics.pdf',
    },
    {
      id: 7,
      name: 'CUET 2023 - Chemistry (Full Paper)',
      url: 'https://example.com/pyq/cuet-2023-chemistry.pdf',
    },
    {
      id: 8,
      name: 'CUET 2023 - Biology (Full Paper)',
      url: 'https://example.com/pyq/cuet-2023-biology.pdf',
    },
    {
      id: 9,
      name: 'CUET 2023 - Mathematics (Full Paper)',
      url: null,
    },
    {
      id: 10,
      name: 'CUET 2022 - General Test',
      url: 'https://example.com/pyq/cuet-2022-general.pdf',
    },
  ];

  private loadMockPYQs(): void {
    setTimeout(() => {
      this.pyqsState = { status: 'loaded', data: this.mockPYQsData };
    }, 500);
  }

  getPYQs(): void {
    this.pyqsState = { status: 'loading' };
    setTimeout(() => {
      this.pyqsState = { status: 'loaded', data: this.mockPYQsData };
    }, 300);
  }

  // ── Modals ────────────────────────────────────────────────────────────────

  onClickStartTest(test: any, testType: string): void {
    this.http.checkUnfinishedTest().pipe(takeUntil(this.destroy$)).subscribe({
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
        this.message?.error(error?.error?.message);
      },
    });
  }

  submitPendingTest(): void {
    const data = {
      testId: this.pendingTestDetails?.testId,
      testItemId: this.pendingTestDetails?.testItemId,
      testType: this.pendingTestDetails?.testType,
    };
    this.http.postSubmitTest(data).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.message.success('Successful! Test submitted!');
        this.onModalClose();
      },
      error: (error: any) => this.message?.error(error?.error?.message),
    });
  }

  onModalClose(): void {
    this.selectedTest = undefined;
    this.selectedTestType = undefined;
    this.isStartTestModal = false;
    this.isInvalidModal = false;
    this.isPendingTest = false;
    this.pendingTestDetails = undefined;
  }

  protected readonly Math = Math;
}
