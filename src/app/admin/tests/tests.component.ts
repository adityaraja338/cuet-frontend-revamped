import { Component } from '@angular/core';
import { Router } from '@angular/router';

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

  collapseFilter: boolean = false;
  totalLiveTestCount = 6;
  livePageIndex = 1;
  pageSize = 30;

  constructor(private readonly router: Router) {}

  onClickTest(event: any, testType: string, testId: number) {
    const excludedSection = (event.target as HTMLElement).closest(
      '.dropdown-container',
    );

    if (excludedSection) {
      // Do nothing if the click was on the excluded section
      return;
    }

    this.router.navigate([this.router.url, testType, testId]);
  }

  protected readonly Math = Math;
}
