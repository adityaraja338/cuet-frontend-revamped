import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { HttpService } from '../../shared/services/http.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  previous = [];

  popoverText = ''; // Text to show inside the popover
  popoverVisible = false;

  subjects: any = [];

  events: any = [];
  notifications: any = [];

  // Doughnut
  doughnutChartLabels: string[] = [
    '# of Correct',
    '# of Incorrect',
    '# of Unattempted',
  ];
  previousChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] = [
    {
      data: [0, 0, 0],
      backgroundColor: ['#8555FD', '#C1B2FF', '#E4E0FA'],
      borderWidth: 4,
      borderRadius: 12,
    },
  ];
  doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: false,
    radius: 56,
    cutout: '78%',
    // borderColor: 'violet'
  };

  averageScoreChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['-', '-', '-', '-', '-', '-', '-'],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, 0],
        label: 'Average',
        fill: true,
        tension: 0.4,
        borderColor: 'black',
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            // Return transparent background if chart area is not ready
            return 'rgba(0,0,0,0)';
          }

          // Create gradient
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom,
          );
          gradient.addColorStop(0, 'rgba(133, 85, 253, 0.5)'); // Top color
          gradient.addColorStop(1, 'rgba(133, 85, 253, 0.1)'); // Bottom transparent

          return gradient;
        },
        showLine: false,
      },
    ],
  };
  averageScoreChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        display: false,
      },
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Series A',
        backgroundColor: '#8555FDD6',
        borderRadius: 10,
        maxBarThickness: 16,
        // fill: true,
      },
    ],
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };
  public barChartLegend = false;

  isPendingTest = false;
  pendingTestDetails: any;

  constructor(
    private http: HttpService,
    private message: NzMessageService,
  ) {}

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
  getLiveTestsOverview() {
    this.http.getLiveTestsOverview().subscribe({
      next: (res: any) => {
        this.upcomingTestOverviewData = res?.data?.upcoming;
        this.previousTestOverviewData = res?.data?.previous;
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
        // this.doughnutChartOptions?.update();
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

  leaderboardData: any[] = [];
  getLeaderboard() {
    this.http.getLeaderboard().subscribe({
      next: (res: any) => {
        this.leaderboardData = res?.data?.leaderboard;
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
