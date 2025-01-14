import { Component, OnInit, ViewChild } from '@angular/core';
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

  resourcesScrollbarOptions: any = {
    direction: 'rtl',
  };

  // leaderboardScrollbarOptions: any = {
  //   // direction: 'ttb',
  // };

  // Doughnut
  public doughnutChartLabels: string[] = [
    '# of Correct',
    '# of Incorrect',
    '# of Unattempted',
  ];
  public overallChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] =
    [
      {
        data: [350, 450, 100],
        backgroundColor: ['#8555FD', '#C1B2FF', '#E4E0FA'],
        borderWidth: 4,
        borderRadius: 12,
      },
    ];
  public previousChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] =
    [
      {
        data: [350, 450, 100],
        backgroundColor: ['#8555FD', '#C1B2FF', '#E4E0FA'],
        borderWidth: 4,
        borderRadius: 12,
      },
    ];
  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: false,
    radius: 56,
    cutout: '78%',
    // borderColor: 'violet'
  };

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Series A',
        fill: true,
        tension: 0.5,
        borderColor: 'black',
        backgroundColor: 'rgba(133, 85, 253, 0.24)',
        showLine: false,
      },
    ],
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
    },
  };
  public lineChartLegend = false;

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
    this.getLiveTestsOverview();
    this.getHomescreenSubjects();
    // this.getPerformanceCharts();
    this.getLeaderboard();
    this.getUserEvents();
    this.getUserNotifications();
    this.checkUnfinishedTest();
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

  getHomescreenSubjects() {
    this.http.getHomescreenSubjects().subscribe({
      next: (res: any) => {
        this.subjects = res?.data;
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  overallPerformanceData: any;
  previousPerformanceData: any;
  getPerformanceCharts() {
    this.http.getPerformanceCharts().subscribe({
      next: (res: any) => {
        this.overallPerformanceData = res?.data?.overallPerformance;
        this.previousPerformanceData = res?.data?.previousTestPerformance;
        this.overallChartDatasets[0].data = [
          res?.data?.overallPerformance?.correct,
          res?.data?.overallPerformance?.incorrect,
          res?.data?.overallPerformance?.unattempted,
        ];
        this.previousChartDatasets[0].data = [
          res?.data?.previousTestPerformance?.correct,
          res?.data?.previousTestPerformance?.incorrect,
          res?.data?.previousTestPerformance?.unattempted,
        ];
        // this.doughnutChartOptions?.update();
        if (this.chart) {
          this.chart.update();
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
        this.leaderboardData = res?.data;
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
  onClickStartTest(data: any) {
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
