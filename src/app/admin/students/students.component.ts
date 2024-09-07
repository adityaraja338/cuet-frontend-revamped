import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss',
})
export class StudentsComponent {
  collapseFilter: boolean = false;

  // Filters
  filterNameOrId: string = '';
  filterBatchId: string = '';

  students: any = [
    {
      id: 0,
      name: 'Test 1',
      questions: 10,
      isFree: true,
      batchId: 90,
    },
    {
      id: 1,
      name: 'Test 2',
      questions: 10,
      isFree: false,
      batchId: 120,
    },
    {
      id: 2,
      name: 'Test 3',
      questions: 10,
      isFree: false,
      batchId: 50,
    },
    {
      id: 3,
      name: 'Test 4',
      questions: 10,
      isFree: true,
      batchId: 75,
    },
    {
      id: 4,
      name: 'Test 5',
      questions: 10,
      isFree: false,
      batchId: 60,
    },
    {
      id: 5,
      name: 'Test 6',
      questions: 10,
      isFree: true,
      batchId: 80,
    },
  ];

  totalCount: number = 6;
  pageIndex: number = 1;
  pageSize: number = 30;

  constructor(private readonly router: Router) {}

  onClickStudent(event: any, studentId: number) {
    const excludedSection = (event.target as HTMLElement).closest(
      '.dropdown-container',
    );

    if (excludedSection) {
      // Do nothing if the click was on the excluded section
      return;
    }

    this.router.navigate([this.router.url, studentId]);
  }

  protected readonly Math = Math;
}
