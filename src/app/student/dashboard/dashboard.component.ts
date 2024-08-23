import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  isBrowser: boolean;
  previous = [1, 2, 3, 4, 5];

  subjects = ['Maths', 'Chemistry', 'Biology', 'Physics', 'Reasoning'];

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

  public doughnutChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] =
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

  leaderboardData: any = [
    { studentName: 'Student 1', scorePercentage: 92 },
    { studentName: 'Student 2', scorePercentage: 91 },
    { studentName: 'Student 3', scorePercentage: 90 },
    { studentName: 'Student 4', scorePercentage: 89 },
    { studentName: 'Student 5', scorePercentage: 88 },
    { studentName: 'Student 6', scorePercentage: 87 },
    { studentName: 'Student 7', scorePercentage: 86 },
    { studentName: 'Student 8', scorePercentage: 85 },
    { studentName: 'Student 9', scorePercentage: 84 },
    { studentName: 'Student 10', scorePercentage: 83 },
    { studentName: 'Student 11', scorePercentage: 82 },
    { studentName: 'Student 12', scorePercentage: 81 },
    { studentName: 'Student 13', scorePercentage: 80 },
    { studentName: 'Student 14', scorePercentage: 79 },
    { studentName: 'Student 15', scorePercentage: 78 },
    { studentName: 'Student 16', scorePercentage: 76 },
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
}
