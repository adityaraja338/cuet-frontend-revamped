import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { HttpService } from '../../shared/services/http.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BaseChartDirective } from 'ng2-charts';
import { GlobalService } from '../../shared/services/global.service';

@Component({
  standalone: false,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  previous = [];

  subjects: any = [];

  events: any = [];
  notifications: any = [];

  today = new Date();

  leaderboardData: any[] = [];

  // Doughnut
  doughnutChartLabels: string[] = [
    '# of Correct',
    '# of Incorrect',
    '# of Unattempted',
  ];
  previousChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] = [
    {
      data: [0, 0, 0],
      backgroundColor: ['oklch(68% 0.17 55)', 'oklch(82% 0.1 55)', 'oklch(95% 0.04 75)'],
      borderWidth: 0,
      borderRadius: 10,
      hoverOffset: 4,
    },
  ];
  doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: false,
    radius: 50,
    cutout: '80%',
    plugins: {
      tooltip: { enabled: false }
    }
  };

  averageScoreChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['-', '-', '-', '-', '-', '-'],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0],
        label: 'Average',
        fill: true,
        tension: 0.4,
        borderColor: 'oklch(68% 0.17 55)',
        pointBackgroundColor: 'oklch(68% 0.17 55)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            return 'rgba(0,0,0,0)';
          }

          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom,
          );
          gradient.addColorStop(0, 'oklch(68% 0.17 55 / 0.15)');
          gradient.addColorStop(1, 'oklch(68% 0.17 55 / 0.01)');

          return gradient;
        },
        showLine: true,
      },
    ],
  };
  averageScoreChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#e2e8f0',
        borderColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        display: false,
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(148, 163, 184, 0.18)',
        },
        ticks: {
          color: '#64748b',
          font: { size: 11 },
          stepSize: 25,
        },
        border: { display: false },
      },
    },
  };

  isPendingTest = false;
  pendingTestDetails: any;

  constructor(
    private http: HttpService,
    private message: NzMessageService,
    public globalService: GlobalService,
  ) {}

  get firstName(): string {
    const name = this.globalService.userDetails?.name?.trim();
    if (!name) {
      return 'there';
    }
    return name.split(' ')[0];
  }

  get greeting(): string {
    const hour = this.today.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  ngOnInit() {
    this.getProgressOverview();
    this.getSubjectAnalysis();
    this.getLiveTestsOverview();
    this.getPerformanceCharts();
    this.getLeaderboard();
    this.getUserEvents();
    this.getUserNotifications();
    this.checkUnfinishedTest();
  }

  progressStats: any;
  getProgressOverview() {
    this.http.getApi(`get-progress-stats`).subscribe({
      next: (res: any) => {
        this.progressStats = res?.data;
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message ?? 'Something went wrong');
      },
    });
  }

  subjectAnalysis: any;
  getSubjectAnalysis() {
    this.http.getApi(`get-subject-analysis`).subscribe({
      next: (res: any) => {
        this.subjectAnalysis = res?.data;
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message ?? 'Something went wrong');
      },
    });
  }

  upcomingTestOverviewData: any;
  previousTestOverviewData: any;
  featuredPreviousTest: any;
  recentPreviousTests: any[] = [];
  getLiveTestsOverview() {
    this.http.getLiveTestsOverview().subscribe({
      next: (res: any) => {
        this.upcomingTestOverviewData = res?.data?.upcoming;
        this.previousTestOverviewData = res?.data?.previous;
        this.featuredPreviousTest = this.previousTestOverviewData?.[0];

        const baseRecentPreviousTests = this.previousTestOverviewData?.slice(1) ?? [];
        this.recentPreviousTests = baseRecentPreviousTests.length
          ? [...baseRecentPreviousTests, ...baseRecentPreviousTests]
          : [];
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  @ViewChildren(BaseChartDirective) charts!: QueryList<BaseChartDirective>;
  overallPerformanceData: any;
  previousPerformanceData: any;
  getPerformanceCharts() {
    this.http.getPerformanceCharts().subscribe({
      next: (res: any) => {
        this.overallPerformanceData = res?.data?.overallPerformance;
        this.previousPerformanceData = res?.data?.previousTestPerformance;

        this.averageScoreChartData.labels =
          res?.data?.overallPerformance?.labels;
        this.averageScoreChartData.datasets[0].data =
          res?.data?.overallPerformance?.scores?.map(
            (score: any) => score ?? 0,
          );

        this.previousChartDatasets[0].data = [
          res?.data?.previousTestPerformance?.correct,
          res?.data?.previousTestPerformance?.incorrect,
          res?.data?.previousTestPerformance?.unattempted,
        ];

        if (this.charts) {
          this.charts.forEach((chart) => chart.update());
        }
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  getLeaderboard() {
    this.http.getLeaderboard().subscribe({
      next: (res: any) => {
        this.leaderboardData = res?.data?.leaderboard ?? [];
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  getUserEvents() {
    this.http.getUserEvents().subscribe({
      next: (res: any) => {
        this.events = res?.data;
        this.filterUpcomingEvents(res?.data);
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error.message);
      },
    });
  }

  getUserNotifications() {
    this.http.getUserNotifications().subscribe({
      next: (res: any) => {
        this.notifications = res?.data;
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error.message);
      },
    });
  }

  checkUnfinishedTest() {
    this.http.checkUnfinishedTest().subscribe({
      next: (res: any) => {
        if (res?.data) {
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
        this.pendingTestDetails = undefined;
        this.isPendingTest = false;
      },
      error: (error: any) => {
        console.log(error);
        this.message?.error(error?.error?.message);
      },
    });
  }

  isStartTestModal: boolean = false;
  currentTest: any;
  currentTestType: 'Live' | 'Recorded' | undefined;
  onClickStartTest(data: any) {
    this.currentTestType = 'Live';
    this.currentTest = data;
    this.isStartTestModal = true;
  }

  onClickPreviousTest(data: any) {
    this.currentTestType = 'Recorded';
    this.currentTest = data;
    this.isStartTestModal = true;
  }

  onModalClose() {
    this.currentTest = undefined;
    this.isStartTestModal = false;
  }

  upcomingEvents: any = [];
  filterUpcomingEvents(events: any) {
    this.upcomingEvents = events?.filter((event: any) => {
      const currentDate = new Date();
      const eventDate = new Date(event?.date);

      if (eventDate?.getMonth() > currentDate?.getMonth()) {
        return true;
      } else if (eventDate?.getMonth() === currentDate?.getMonth()) {
        return eventDate?.getDate() >= currentDate?.getDate();
      } else {
        return false;
      }
    });
  }
}
