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
  styleUrl: './resources.component.css',
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
    this.getVideoLinks();
    this.getNewspapers();
    this.getPYQs();

    this.searchNewspaperSubject
      .pipe(debounceTime(this.debounceTimeMs), takeUntil(this.destroy$))
      .subscribe((value) => {
        this.searchNewspaper = value;
        this.newspaperPageIndex = 1;
        this.getNewspapers();
      });

    this.searchVideoSubject
      .pipe(debounceTime(this.debounceTimeMs), takeUntil(this.destroy$))
      .subscribe((value) => {
        this.searchVideo = value;
        this.videosPageIndex = 1;
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

  getVideoLinks(event?: { pageIndex?: number; pageSize?: number }): void {
    if (event?.pageIndex != null) {
      this.videosPageIndex = event.pageIndex;
    }
    if (event?.pageSize != null) {
      this.videosPageSize = event.pageSize;
    }

    const params: Record<string, string | number> = {
      page: this.videosPageIndex,
      limit: this.videosPageSize,
    };
    if (this.searchVideo) {
      params['search'] = this.searchVideo;
    }

    this.videosState = { status: 'loading' };
    this.http.getVideoLinks(params).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        const items = res?.data?.videos ?? res?.data?.videoLinks ?? [];
        const total = Number(res?.data?.total ?? 0);
        this.videosState = { status: 'loaded', data: { items, total } };
      },
      error: (error: any) => {
        this.videosState = { status: 'loaded', data: { items: [], total: 0 } };
        this.message?.error(error?.error?.message ?? 'Failed to load videos');
      },
    });
  }

  onSearchVideoLinks(value: string): void {
    this.searchVideoSubject.next(value);
  }

  onViewVideo(_id: number): void {
    // Reserved for analytics / future deep links
  }

  // ── Newspapers ────────────────────────────────────────────────────────────

  getNewspapers(event?: { pageIndex?: number; pageSize?: number }): void {
    if (event?.pageIndex != null) {
      this.newspaperPageIndex = event.pageIndex;
    }
    if (event?.pageSize != null) {
      this.newspaperPageSize = event.pageSize;
    }

    const params: Record<string, string | number> = {
      page: this.newspaperPageIndex,
      limit: this.newspaperPageSize,
    };
    if (this.searchNewspaper) {
      params['search'] = this.searchNewspaper;
    }
    if (this.searchNewspaperDate) {
      const d = this.searchNewspaperDate as Date;
      params['date'] = d instanceof Date ? d.toISOString() : String(this.searchNewspaperDate);
    }

    this.newspapersState = { status: 'loading' };
    this.http.getNewspapers(params).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        const items = res?.data?.newspapers ?? [];
        const total = Number(res?.data?.total ?? 0);
        this.newspapersState = { status: 'loaded', data: { items, total } };
      },
      error: (error: any) => {
        this.newspapersState = { status: 'loaded', data: { items: [], total: 0 } };
        this.message?.error(error?.error?.message ?? 'Failed to load newspapers');
      },
    });
  }

  onSearchNewspaper(value: string): void {
    this.searchNewspaperSubject.next(value);
  }

  // ── PYQs ─────────────────────────────────────────────────────────────────

  getPYQs(): void {
    this.pyqsState = { status: 'loading' };
    this.http.getPYQs().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        const raw = res?.data;
        const list = Array.isArray(raw) ? raw : raw?.pyqs ?? [];
        this.pyqsState = { status: 'loaded', data: list };
      },
      error: (error: any) => {
        this.pyqsState = { status: 'loaded', data: [] };
        this.message?.error(error?.error?.message ?? 'Failed to load PYQs');
      },
    });
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
