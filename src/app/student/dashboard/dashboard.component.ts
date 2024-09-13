import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { HttpService } from '../../shared/services/http.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  previous = [1, 2, 3, 4, 5];

  subjects: any = [
    'English',
    'Maths',
    'Reasoning',
    'GS & GK',
    'Biology',
    'Physics',
  ];

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

  constructor(
    private http: HttpService,
    private message: NzMessageService,
  ) {}

  ngOnInit() {
    this.getLiveTestsOverview();
    this.getHomescreenSubjects();
    this.getPerformanceCharts();
    this.getLeaderboard();
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

  leaderboardData: any;
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
}
