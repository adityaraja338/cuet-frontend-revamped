import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../../shared/services/http.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-performances',
  templateUrl: './performances.component.html',
  styleUrl: './performances.component.scss',
})
export class PerformancesComponent implements OnInit {
  isPerformanceModal = false;
  isLeaderboardVisible = false;
  isShowAnswer = false;
  selectedPerformance: any;
  leaderboardData: any;

  tabIndex = 0;

  public doughnutChartLabels: string[] = [
    '# of Correct',
    '# of Incorrect',
    '# of Unattempted',
  ];

  public performanceChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] =
    [
      {
        data: [0, 0, 0],
        backgroundColor: ['#8555FD', '#C1B2FF', '#E4E0FA'],
        borderWidth: 4,
        borderRadius: 12,
      },
    ];

  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: false,
    radius: 48,
    cutout: '78%',
  };

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
      const tabIndex = params['tab'] || 0; // Default to the first tab
      this.tabIndex = tabIndex !== -1 ? tabIndex : 0;
    });
  }

  onTabChange(index: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: index },
      queryParamsHandling: 'merge', // Preserve other query params
    });
  }

  livePerformances: any[] = [];
  isLiveLoading = false;
  totalLiveCount!: number;
  livePageIndex = 1;
  livePageSize = 30;
  getLivePerformances() {
    const data = {
      page: this.livePageIndex,
      limit: this.livePageSize,
    };

    this.http.getApi(`get-test-performances/live`, data).subscribe({
      next: (res: any) => {
        this.livePerformances = res?.data?.performances;
        this.totalLiveCount = res?.data?.total;
      },
      error: (error: any) => {
        console.log(error);
        this.message?.error(error?.error?.message);
      },
    });
  }

  recordedPerformances: any[] = [];
  isRecordedLoading = false;
  totalRecordedCount!: number;
  recordedPageIndex = 1;
  recordedPageSize = 30;
  getRecordedPerformances() {
    const data = {
      page: this.livePageIndex,
      limit: this.livePageSize,
    };

    this.http.getApi(`get-test-performances/recorded`, data).subscribe({
      next: (res: any) => {
        this.recordedPerformances = res?.data?.performances;
        this.totalRecordedCount = res?.data?.total;
      },
      error: (error: any) => {
        console.log(error);
        this.message?.error(error?.error?.message);
      },
    });
  }

  mockPerformances: any[] = [];
  isMockLoading = false;
  totalMockCount!: number;
  mockPageIndex = 1;
  mockPageSize = 30;
  getMockPerformances() {
    const data = {
      page: this.mockPageIndex,
      limit: this.mockPageSize,
    };

    this.http.getApi(`get-test-performances/mock`, data).subscribe({
      next: (res: any) => {
        this.mockPerformances = res?.data?.performances;
        this.totalMockCount = res?.data?.total;
      },
      error: (error: any) => {
        console.log(error);
        this.message?.error(error?.error?.message);
      },
    });
  }

  topicPerformances: any[] = [];
  isTopicLoading = false;
  totalTopicCount!: number;
  topicPageIndex = 1;
  topicPageSize = 30;
  getTopicPerformances() {
    const data = {
      page: this.mockPageIndex,
      limit: this.mockPageSize,
    };

    this.http.getApi(`get-test-performances/topic`, data).subscribe({
      next: (res: any) => {
        this.topicPerformances = res?.data?.performances;
        this.totalTopicCount = res?.data?.total;
      },
      error: (error: any) => {
        console.log(error);
        this.message?.error(error?.error?.message);
      },
    });
  }

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  onClickPerformance(performance: any) {
    this.selectedPerformance = performance;

    if (this.selectedPerformance?.previousScoreObtained) {
      const current =
        Math.round(
          (this.selectedPerformance?.scoreObtained /
            this.selectedPerformance?.totalScore) *
            10000,
        ) / 100;

      const previous =
        Math.round(
          (this.selectedPerformance?.previousScoreObtained /
            this.selectedPerformance?.previousTotalScore) *
            10000,
        ) / 100;

      const difference = current - previous;

      this.selectedPerformance.scoreDifference =
        difference > 0 ? '+' + difference : difference;
    }

    this.performanceChartDatasets[0].data = [
      performance?.correct,
      performance?.incorrect,
      performance?.unattempted,
    ];
    this.chart?.update();
    this.isPerformanceModal = true;
  }

  getTestLeaderboard() {
    this.isLeaderboardVisible = !this.isLeaderboardVisible;

    if (!this.isLeaderboardVisible) {
      return;
    }

    if (!this.selectedPerformance) {
      this.message.error('Error! No test selected!');
      return;
    }

    const data = {
      testId: this.selectedPerformance?.testId,
      testType: this.selectedPerformance?.testType,
    };

    this.http.getTestLeaderboard(data).subscribe({
      next: (res: any) => {
        this.leaderboardData = res?.data;
      },
      error: (error: any) => {
        console.log(error);
        this.message?.error(error?.error?.message);
      },
    });
  }

  onModalClose() {
    this.isLeaderboardVisible = false;
    this.isPerformanceModal = false;
    this.isShowAnswer = false;
    this.selectedPerformance = null;
  }
}
