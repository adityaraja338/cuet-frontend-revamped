import { Component } from '@angular/core';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-batch-detail',
  templateUrl: './batch-detail.component.html',
  styleUrl: './batch-detail.component.scss',
})
export class BatchDetailComponent {
  studentData: any = [
    { id: 1, name: 'Aditya', score: '120/240', accuracy: '50%' },
    { id: 2, name: 'Aditya 2', score: '124/240', accuracy: '50%' },
    { id: 3, name: 'Aditya 3', score: '190/240', accuracy: '50%' },
    { id: 4, name: 'Aditya 4', score: '156/240', accuracy: '50%' },
    { id: 5, name: 'Aditya 5', score: '152/240', accuracy: '50%' },
    { id: 6, name: 'Aditya 6', score: '112/240', accuracy: '50%' },
    { id: 7, name: 'Aditya 7', score: '167/240', accuracy: '50%' },
    { id: 8, name: 'Aditya 8', score: '78/240', accuracy: '50%' },
  ];

  public doughnutChartLabels: string[] = [
    '# of Students with Avg. > %50',
    '# of Students with Avg. <= %50',
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
    responsive: true,
    maintainAspectRatio: false,
    radius: 60,
    cutout: '78%',
    // borderColor: 'violet'
  };
}
