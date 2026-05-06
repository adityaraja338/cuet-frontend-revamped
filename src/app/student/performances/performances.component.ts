import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../shared/services/http.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-performances',
  templateUrl: './performances.component.html',
  styleUrl: './performances.component.css',
})
export class PerformancesComponent implements OnInit {
  tabIndex = 0;
  expandedId: string | null = null;

  motivatingStatements = [
    'Every test is a step closer to your dream university.',
    'Progress is built one attempt at a time. Keep going!',
    'Mistakes are just lessons in disguise. Analyze and conquer.',
    'Consistency is the key to mastering CUET. Your next attempt is waiting.',
    "You're doing great! Let's see how much further we can go today.",
  ];

  livePerformances: any[] = [];
  isLiveLoading = false;
  totalLiveCount!: number;
  livePageIndex = 1;
  livePageSize = 30;

  recordedPerformances: any[] = [];
  isRecordedLoading = false;
  totalRecordedCount!: number;
  recordedPageIndex = 1;
  recordedPageSize = 30;

  mockPerformances: any[] = [];
  isMockLoading = false;
  totalMockCount!: number;
  mockPageIndex = 1;
  mockPageSize = 30;

  topicPerformances: any[] = [];
  isTopicLoading = false;
  totalTopicCount!: number;
  topicPageIndex = 1;
  topicPageSize = 30;

  constructor(
    private http: HttpService,
    private message: NzMessageService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.getLivePerformances();
    this.getRecordedPerformances();
    this.getMockPerformances();
    this.getTopicPerformances();

    this.route.queryParams.subscribe((params) => {
      const tabIndex = params['tab'] || 0;
      this.tabIndex = tabIndex !== -1 ? tabIndex : 0;
    });
  }

  onTabChange(index: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: index },
      queryParamsHandling: 'merge',
    });
  }

  getLivePerformances() {
    this.isLiveLoading = true;
    this.http
      .getApi(`get-test-performances/live`, {
        page: this.livePageIndex,
        limit: this.livePageSize,
      })
      .subscribe({
        next: (res: any) => {
          this.livePerformances = res?.data?.performances;
          this.totalLiveCount = res?.data?.total;
          this.isLiveLoading = false;
        },
        error: (error: any) => {
          this.message?.error(error?.error?.message);
          this.isLiveLoading = false;
        },
      });
  }

  getRecordedPerformances() {
    this.isRecordedLoading = true;
    this.http
      .getApi(`get-test-performances/recorded`, {
        page: this.recordedPageIndex,
        limit: this.recordedPageSize,
      })
      .subscribe({
        next: (res: any) => {
          this.recordedPerformances = res?.data?.performances;
          this.totalRecordedCount = res?.data?.total;
          this.isRecordedLoading = false;
        },
        error: (error: any) => {
          this.message?.error(error?.error?.message);
          this.isRecordedLoading = false;
        },
      });
  }

  getMockPerformances() {
    this.isMockLoading = true;
    this.http
      .getApi(`get-test-performances/mock`, {
        page: this.mockPageIndex,
        limit: this.mockPageSize,
      })
      .subscribe({
        next: (res: any) => {
          this.mockPerformances = res?.data?.performances;
          this.totalMockCount = res?.data?.total;
          this.isMockLoading = false;
        },
        error: (error: any) => {
          this.message?.error(error?.error?.message);
          this.isMockLoading = false;
        },
      });
  }

  getTopicPerformances() {
    this.isTopicLoading = true;
    this.http
      .getApi(`get-test-performances/topic`, {
        page: this.topicPageIndex,
        limit: this.topicPageSize,
      })
      .subscribe({
        next: (res: any) => {
          this.topicPerformances = res?.data?.performances;
          this.totalTopicCount = res?.data?.total;
          this.isTopicLoading = false;
        },
        error: (error: any) => {
          this.message?.error(error?.error?.message);
          this.isTopicLoading = false;
        },
      });
  }

  onClickPerformance(performance: any) {
    this.router.navigate(['detail', performance.id], { relativeTo: this.route });
  }

  toggleExpand(id: string) {
    this.expandedId = this.expandedId === id ? null : id;
  }
}
