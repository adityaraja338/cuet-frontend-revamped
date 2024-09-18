import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../../shared/services/http.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-performances',
  templateUrl: './performances.component.html',
  styleUrl: './performances.component.scss',
})
export class PerformancesComponent implements OnInit {
  livePerformances: any;
  recordedPerformances: any;
  mockPerformances: any;
  topicPerformances: any;

  isPerformanceModal = false;
  isLeaderboardVisible = false;
  selectedPerformance: any;
  leaderboardData: any;

  public doughnutChartLabels: string[] = [
    '# of Correct',
    '# of Incorrect',
    '# of Unattempted',
  ];

  public performanceChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] =
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
    radius: 48,
    cutout: '78%',
  };

  constructor(
    private http: HttpService,
    private message: NzMessageService,
  ) {}

  ngOnInit() {
    this.getPerformances();
  }

  getPerformances() {
    this.http.getPerformances().subscribe({
      next: (res: any) => {
        this.livePerformances = res?.data?.live;
        this.recordedPerformances = res?.data?.recorded;
        this.mockPerformances = res?.data?.mock;
        this.topicPerformances = res?.data?.topic;

        // this.selectedPerformance = this.livePerformances[0];
        this.performanceChartDatasets[0].data = [
          this.selectedPerformance?.correct,
          this.selectedPerformance?.incorrect,
          this.selectedPerformance?.unattempted,
        ];
        this.chart?.update();
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
    this.selectedPerformance = null;
  }

  protected readonly Math = Math;
}
