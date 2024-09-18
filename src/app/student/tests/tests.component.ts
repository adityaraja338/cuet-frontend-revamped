import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../shared/services/http.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrl: './tests.component.scss',
})
export class TestsComponent implements OnInit {
  recordedTests: any;
  mockTests: any;

  currentTabIndex = 0;

  isInvalidModal = false;
  isStartTestModal = false;
  selectedTest: any;
  selectedTestType: any;

  constructor(
    private http: HttpService,
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.getRecordedAndMockTests();
    this.route.queryParams.subscribe((params) => {
      const tabIndex = params['tab'];
      if (
        tabIndex !== undefined &&
        !isNaN(tabIndex) &&
        tabIndex >= 0 &&
        tabIndex < 3
      ) {
        this.currentTabIndex = Number(tabIndex);
      }
    });
  }

  getRecordedAndMockTests() {
    this.http.getRecordedAndMockTests().subscribe({
      next: (res: any) => {
        this.recordedTests = res?.data?.recordedTests;
        this.mockTests = res?.data?.mockTests;
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  onClickStartTest(test: any, testType: string) {
    if (!test?.canAttempt) {
      this.isInvalidModal = true;
    } else {
      this.selectedTest = test;
      this.selectedTestType = testType;
      this.isStartTestModal = true;
    }
  }

  onTabChange(index: number): void {
    this.router.navigate([], {
      queryParams: { tab: index },
      queryParamsHandling: 'merge', // Keep the existing query params
    });
  }

  protected readonly Math = Math;
}
