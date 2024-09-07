import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { isPlatformBrowser } from '@angular/common';
import { HttpService } from '../../shared/services/http.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  isBrowser: boolean;
  isModalVisible = false;
  modalName: string = '';

  public doughnutChartLabels: string[] = [
    '# of Good Performing Students',
    '# of Bad Performing Students',
  ];

  public doughnutChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] =
    [
      {
        data: [350, 450],
        backgroundColor: ['rgba(0, 163, 255, 1)', 'rgba(200, 221, 255, 1)'],
        borderWidth: 2,
        borderRadius: 12,
      },
    ];

  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: false,
    radius: 46,
    cutout: '78%',
    // borderColor: 'violet'
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private readonly http: HttpService,
    private message: NzMessageService,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.getLastTestDate();
    this.getBestAndWorstStudents();
  }

  lastTestDate?: Date;
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

  bestStudents: any = [];
  worstStudents: any = [];
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

  showModal(modalName: string) {
    this.modalName = modalName;
    this.isModalVisible = true;
  }

  handleCloseModal() {
    this.isModalVisible = false;
    this.modalName = '';
  }
}
