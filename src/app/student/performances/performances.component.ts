import { Component } from '@angular/core';

@Component({
  selector: 'app-performances',
  templateUrl: './performances.component.html',
  styleUrl: './performances.component.scss',
})
export class PerformancesComponent {
  topicTests: any = [
    {
      id: 0,
      name: 'Test 1',
      attempted: 12,
      total: 15,
      scoreObtained: 48,
      totalScore: 75,
      date: '12-08-2024',
    },
    {
      id: 1,
      name: 'Test 2',
      attempted: 12,
      total: 15,
      scoreObtained: 50,
      totalScore: 75,
      date: '12-08-2024',
    },
    {
      id: 2,
      name: 'Test 3',
      attempted: 12,
      total: 15,
      scoreObtained: 42,
      totalScore: 75,
      date: '12-08-2024',
    },
    {
      id: 3,
      name: 'Test 4',
      attempted: 12,
      total: 15,
      scoreObtained: 36,
      totalScore: 75,
      date: '12-08-2024',
    },
    {
      id: 4,
      name: 'Test 5',
      attempted: 12,
      total: 15,
      scoreObtained: 54,
      totalScore: 75,
      date: '12-08-2024',
    },
    {
      id: 5,
      name: 'Test 6',
      attempted: 15,
      total: 15,
      scoreObtained: 45,
      totalScore: 75,
      date: '12-08-2024',
    },
  ];

  protected readonly Math = Math;
}
