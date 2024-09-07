import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-batches',
  templateUrl: './batches.component.html',
  styleUrl: './batches.component.scss',
})
export class BatchesComponent {
  batches: any = [
    {
      id: 0,
      name: 'Batch 1',
      studentCount: 10,
      testCount: 90,
    },
    {
      id: 1,
      name: 'Batch 2',
      studentCount: 10,
      testCount: 120,
    },
    {
      id: 2,
      name: 'Batch 3',
      studentCount: 10,
      testCount: 50,
    },
    {
      id: 3,
      name: 'Batch 4',
      studentCount: 10,
      testCount: 75,
    },
    {
      id: 4,
      name: 'Batch 5',
      studentCount: 10,
      testCount: 60,
    },
    {
      id: 5,
      name: 'Batch 6',
      studentCount: 10,
      testCount: 80,
    },
  ];

  collapseFilter: boolean = false;
  totalBatchCount = 6;
  pageIndex = 1;
  pageSize = 30;

  constructor(private readonly router: Router) {}

  onClickBatch(event: any, batchId: number) {
    const excludedSection = (event.target as HTMLElement).closest(
      '.dropdown-container',
    );

    if (excludedSection) {
      // Do nothing if the click was on the excluded section
      return;
    }

    this.router.navigate([this.router.url, batchId]);
  }

  protected readonly Math = Math;
}
