import { Component } from '@angular/core';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrl: './tests.component.scss',
})
export class TestsComponent {
  topicTests: any = [
    {
      id: 0,
      name: 'Test 1',
      topics: ['topic1', 'topic2'],
      questions: 10,
      isFree: true,
      duration: 90,
    },
    {
      id: 1,
      name: 'Test 2',
      topics: ['topic1', 'topic2'],
      questions: 10,
      isFree: false,
      duration: 120,
    },
    {
      id: 2,
      name: 'Test 3',
      topics: ['topic1', 'topic2'],
      questions: 10,
      isFree: false,
      duration: 50,
    },
    {
      id: 3,
      name: 'Test 4',
      topics: ['topic1', 'topic2'],
      questions: 10,
      isFree: true,
      duration: 75,
    },
    {
      id: 4,
      name: 'Test 5',
      topics: ['topic1', 'topic2'],
      questions: 10,
      isFree: false,
      duration: 60,
    },
    {
      id: 5,
      name: 'Test 6',
      topics: ['topic1', 'topic2'],
      questions: 10,
      isFree: true,
      duration: 80,
    },
  ];

  totalLiveTestCount = 6;
  livePageIndex = 1;
  pageSize = 30;

  protected readonly Math = Math;
}
