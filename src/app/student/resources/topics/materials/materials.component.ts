import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../../../shared/services/http.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrl: './materials.component.scss',
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
    if (!test?.canAttempt) {
      this.isInvalidModal = true;
    } else {
      this.selectedTest = test;
      this.selectedTestType = testType;
      this.isStartTestModal = true;
    }
  }

  protected readonly Math = Math;
}
