import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AdminHttpService } from '../../shared/services/admin-http.service';
import { BaseChartDirective } from 'ng2-charts';
import { GlobalService } from '../../shared/services/global.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  lastTestDate?: Date;
  bestStudents: any = [];
  worstStudents: any = [];

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  overallPerformance: any;

  bestBatch: any;
  worstBatch: any;

  overallMetricDetails: any;

  events: any = [];
  notifications: any = [];

  isModalVisible = false;
  modalName: string = '';

  public doughnutChartLabels: string[] = [
    '# of Good Performing Students',
    '# of Bad Performing Students',
  ];

  public doughnutChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] =
    [
      {
        data: [0, 0],
        backgroundColor: ['rgba(0, 163, 255, 1)', 'rgba(200, 221, 255, 1)'],
        borderWidth: 2,
        borderRadius: 12,
      },
    ];

  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: false,
    maintainAspectRatio: false,
    radius: 46,
    cutout: '78%',
    // borderColor: 'violet'
    // plugins: {
    //   tooltip: {
    //     // You can try disabling color boxes if they cause layout issues
    //     displayColors: false,
    //     // Adjust padding or other properties to give the tooltip more room
    //     padding: 10,
    //     cornerRadius: 4,
    //     // Optionally, add a custom callback if you need to adjust the tooltip content
    //     callbacks: {
    //       label: (context) => {
    //         const label = context.label || '';
    //         const value = context.raw || '';
    //         return `${label}: ${value}`;
    //       },
    //     },
    //     // If you need to reposition the tooltip, consider using a custom external tooltip or adjust the position
    //     // For example, using the 'nearest' position:
    //     position: 'nearest',
    //   },
    // },
  };

  constructor(
    private readonly http: AdminHttpService,
    private message: NzMessageService,
    protected readonly globalService: GlobalService,
  ) {}

  ngOnInit() {
    this.getLastTestDate();
    this.getBestAndWorstStudents();
    this.getOverallPerformance();
    this.getBestAndWorstBatch();
    this.getCountMetrics();
    this.getUserEvents();
    this.getUserNotifications();
  }

  getLastTestDate() {
    this.http.getLastTestDate().subscribe({
      next: (res: any) => {
        // console.log(res);
        this.lastTestDate = new Date(res?.data.date);
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error.message);
      },
    });
  }

  getBestAndWorstStudents() {
    this.http.getBestAndWorstStudents().subscribe({
      next: (res: any) => {
        this.bestStudents = res?.data?.topStudents;
        this.worstStudents = res?.data?.worstStudents;
        console.log(this.bestStudents);
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error.message);
      },
    });
  }

  getOverallPerformance() {
    this.http.getOverallPerformance().subscribe({
      next: (res: any) => {
        this.overallPerformance = res?.data;
        this.doughnutChartDatasets[0].data = [
          this.overallPerformance?.goodNumber,
          this.overallPerformance?.badNumber,
        ];
        this.chart?.update();
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error.message);
      },
    });
  }

  getBestAndWorstBatch() {
    this.http.getBestAndWorstBatch().subscribe({
      next: (res: any) => {
        this.bestBatch = res?.data?.bestBatch;
        this.worstBatch = res?.data?.worstBatch;
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error.message);
      },
    });
  }

  getCountMetrics() {
    this.http.getCountMetrics().subscribe({
      next: (res: any) => {
        this.overallMetricDetails = res?.data;
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error.message);
      },
    });
  }

  getUserEvents() {
    this.http.getUserEvents().subscribe({
      next: (res: any) => {
        this.events = res?.data;
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

  getRefreshLeaderboard() {
    this.http.getRefreshLeaderboard().subscribe({
      next: (res: any) => {
        this.message?.success('Successful! Leaderboard Refreshed!');
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error.message);
      },
    });
  }

  showModal(modalName: string) {
    this.modalName = modalName;
    this.isModalVisible = true;
  }

  handleCloseModal() {
    this.isModalVisible = false;
    this.modalName = '';
  }
}
