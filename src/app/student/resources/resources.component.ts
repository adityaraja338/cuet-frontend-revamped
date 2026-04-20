import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../shared/services/http.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject, debounceTime, takeUntil } from 'rxjs';

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
    this.http.getSubjects().subscribe({
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

    this.http.getVideoLinks(data).subscribe({
      next: (res: any) => {
        this.videoLinks = res?.data?.videoLinks ?? [];
        this.totalVideos = res?.data?.total ?? 0;
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

    this.http.getNewspapers(data).subscribe({
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
    this.http.getPYQs().subscribe({
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
