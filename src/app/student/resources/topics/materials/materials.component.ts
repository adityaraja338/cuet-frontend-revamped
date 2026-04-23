import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../../../shared/services/http.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  standalone: false,
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrl: './materials.component.css',
})
export class MaterialsComponent implements OnInit {
  subjectName: string = 'Subject';
  subjectId: any;
  topicName: string = 'Topic';
  topicId: any;

  materials: any;

  searchTest: string = '';
  topicTests: any;
  topicPageIndex: number = 1;
  topicPageSize: number = 30;
  totalTopicTests: number = 0;

  isInvalidModal = false;
  isStartTestModal = false;
  selectedTest: any;
  selectedTestType: any;

  isPendingTest = false;
  pendingTestDetails: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpService,
    private message: NzMessageService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('topicId');
    this.topicId = id;

    if (!isNaN(this.topicId)) {
      this.getMaterials();
      this.getTopicTests();
    } else {
      // this.router.navigate(['/', 'student', 'resources', this.subjectId]);
      this.message.error('Error! Invalid topic');
    }
  }

  getMaterials() {
    const data: any = {
      topicId: this.topicId,
    };

    this.http.getMaterials(data).subscribe({
      next: (res: any) => {
        this.materials = res?.data?.materials;
        this.subjectName = res?.data?.subjectName;
        this.subjectId = res?.data?.subjectId;
        this.topicName = res?.data?.topicName;
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  getTopicTests(event?: any) {
    const data: any = {
      topicId: this.topicId,
      page: this.topicPageIndex,
      limit: this.topicPageSize,
    };

    if (event) {
      data['page'] = event?.pageIndex;
      data['limit'] = event?.pageSize;
    }

    if (this.searchTest) {
      data['search'] = this.searchTest;
    }

    this.http.getTopicTests(data).subscribe({
      next: (res: any) => {
        this.topicTests = res?.data?.tests;
        this.totalTopicTests = res?.data?.total;
      },
      error: (error: any) => {
        console.log(error);
        this.message?.error(error?.error?.message);
      },
    });
  }

  onClickStartTest(test: any, testType: string) {
    this.http.checkUnfinishedTest().subscribe({
      next: (res: any) => {
        // this.notifications = res?.data;
        if (!res?.data) {
          if (!test?.canAttempt) {
            this.isInvalidModal = true;
          } else {
            this.selectedTest = test;
            this.selectedTestType = testType;
            this.isStartTestModal = true;
          }
        } else {
          this.pendingTestDetails = res?.data;
          this.isPendingTest = true;
        }
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error.message);
      },
    });
  }

  submitPendingTest() {
    const data: any = {
      testId: this.pendingTestDetails?.testId,
      testItemId: this.pendingTestDetails?.testItemId,
      testType: this.pendingTestDetails?.testType,
    };

    this.http.postSubmitTest(data).subscribe({
      next: (res: any) => {
        this.message.success('Successful! Test submitted!');
        this.onModalClose();
      },
      error: (error: any) => {
        console.log(error);
        this.message?.error(error?.error?.message);
      },
    });
  }

  onReadMaterial(id: number) {
    this.http.postLogAccess({ itemId: id, itemType: 'material' }).subscribe({
      next: (res: any) => {
        // Nothing to do
      },
      error: (error: any) => {
        console.log(error);
        this.message?.error(error?.error?.message);
      },
    });
  }

  onModalClose() {
    this.selectedTest = undefined;
    this.isStartTestModal = false;
    this.isInvalidModal = false;
    this.isPendingTest = false;
    this.pendingTestDetails = undefined;
  }

  protected readonly Math = Math;
}
