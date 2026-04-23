import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AdminHttpService } from '../../../shared/services/admin-http.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { GlobalService } from '../../../shared/services/global.service';

@Component({
  standalone: false,
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrl: './student-detail.component.css',
})
export class StudentDetailComponent implements OnInit {
  studentPerformanceData: any = [];

  batches: any;
  features: any;
  yearsOptions: any;

  studentDetails: any;
  studentPerformances: any;

  isEditModal = false;
  studentId: any;
  editStudentDetails: any;
  editForm: FormGroup;

  isPerformanceModal = false;
  isLeaderboardVisible = false;
  leaderboardData: any;
  public doughnutChartLabels: string[] = [
    '# of Correct',
    '# of Incorrect',
    '# of Unattempted',
  ];
  public performanceChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] =
    [
      {
        data: [0, 0, 0],
        backgroundColor: ['#13AAFF', '#A6DFFF', '#DEF3FF'],
        borderWidth: 4,
        borderRadius: 12,
      },
    ];
  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: false,
    radius: 48,
    cutout: '78%',
  };

  isLoading = false;

  constructor(
    private readonly router: Router,
    private readonly http: AdminHttpService,
    private readonly message: NzMessageService,
    private readonly formBuilder: FormBuilder,
    protected readonly globalService: GlobalService,
  ) {
    this.editForm = this.formBuilder.group({
      studentId: [{ value: null, disabled: true }, [Validators.required]],
      name: [null, [Validators.required]],
      phone: [
        null,
        [Validators.required, Validators.pattern(/^\+\d{1,4}-\d{7,15}$/)],
      ],
      email: [null, [Validators.required]],
      imageUrl: [
        null,
        [
          Validators.required,
          Validators.pattern(
            /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/,
          ),
        ],
      ],
      age: [null, [Validators.required]],
      cuetAttempts: [[]],
      batchId: [null],
      features: [[]],
    });
  }

  ngOnInit() {
    const urlFragments = this.router.url
      .split('/')
      .filter((fragment) => fragment);
    // console.log(urlFragments);
    if (isNaN(Number(urlFragments[urlFragments.length - 1]))) {
      this.router.navigate(['/', 'admin', 'students']);
    } else {
      this.studentId = +urlFragments[urlFragments.length - 1];
      this.getStudentDetails();
    }

    this.getBatchList();
    this.getFeaturesList();
    this.getYearsFrom2022();
  }

  getStudentDetails() {
    this.isLoading = true;
    this.http.getStudentDetails({ studentId: this.studentId }).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.studentDetails = res?.data?.student;
        this.studentPerformances = res?.data?.performances;
        this.calculateAverageScore();
      },
      error: (error: any) => {
        this.isLoading = false;
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  calculateAverageScore() {
    let totalLiveScoreObtained = 0;
    let totalLiveScore = 0;
    let totalRecordedScoreObtained = 0;
    let totalRecordedScore = 0;
    let totalMockScoreObtained = 0;
    let totalMockScore = 0;
    let totalTopicScoreObtained = 0;
    let totalTopicScore = 0;

    this.studentPerformances?.live?.forEach((performance: any) => {
      totalLiveScoreObtained += performance?.scoreObtained;
      totalLiveScore += performance?.totalScore;
    });

    this.studentDetails.liveAverage =
      Math.round((totalLiveScoreObtained / totalLiveScore) * 10000) / 100;

    this.studentPerformances?.recorded?.forEach((performance: any) => {
      totalRecordedScoreObtained += performance?.scoreObtained;
      totalRecordedScore += performance?.totalScore;
    });

    this.studentDetails.recordedAverage =
      Math.round((totalRecordedScoreObtained / totalRecordedScore) * 10000) /
      100;

    this.studentPerformances?.mock?.forEach((performance: any) => {
      totalMockScoreObtained += performance?.scoreObtained;
      totalMockScore += performance?.totalScore;
    });

    this.studentDetails.mockAverage =
      Math.round((totalMockScoreObtained / totalMockScore) * 10000) / 100;

    this.studentPerformances?.topic?.forEach((performance: any) => {
      totalTopicScoreObtained += performance?.scoreObtained;
      totalTopicScore += performance?.totalScore;
    });

    this.studentDetails.topicAverage =
      Math.round((totalTopicScoreObtained / totalTopicScore) * 10000) / 100;
  }

  patchForm() {
    this.editForm.reset();
    this.editForm?.get('studentId')?.patchValue(this.studentId);
    this.editForm?.get('name')?.patchValue(this.studentDetails?.name);
    this.editForm?.get('batchId')?.patchValue(this.studentDetails?.batchId);
    this.editForm?.get('phone')?.patchValue(this.studentDetails?.phone);
    this.editForm?.get('email')?.patchValue(this.studentDetails?.email);
    this.editForm?.get('imageUrl')?.patchValue(this.studentDetails?.imageUrl);
    this.editForm?.get('age')?.patchValue(this.studentDetails?.age);
    this.editForm
      ?.get('cuetAttempts')
      ?.patchValue(this.studentDetails?.cuetAttempts);
    this.editForm
      ?.get('features')
      ?.patchValue(this.studentDetails?.individualFeatures);
  }

  onEditStudent() {
    if (this.editForm.valid) {
      const data: any = {
        studentId: this.studentId,
        studentName: this.editForm?.get('name')?.value,
        email: this.editForm?.get('email')?.value,
        phone: this.editForm?.get('phone')?.value,
        age: this.editForm?.get('age')?.value,
        cuetAttempts: this.editForm?.get('cuetAttempts')?.value,
        batchId: this.editForm?.get('batchId')?.value,
        imageUrl: this.editForm?.get('imageUrl')?.value,
        individualFeatures: this.editForm?.get('features')?.value,
      };

      this.http.putEditStudent(data).subscribe({
        next: (res: any) => {
          this.getStudentDetails();
          this.message.success('Successful! Student updated!');
          this.onModalClose();
        },
        error: (error: any) => {
          console.log(error);
          this.message.error(error?.error?.message);
        },
      });
    } else {
      this.message.error('Marked field are mandatory!');
      Object.keys(this.editForm.controls).forEach((field) => {
        const control = this.editForm?.get(field);
        if (control instanceof FormControl) {
          control.markAsDirty({ onlySelf: true });
          control.updateValueAndValidity({ onlySelf: true });
          control.markAsTouched({ onlySelf: true });
        }
      });
    }
  }

  getBatchList() {
    this.http.getBatchList().subscribe({
      next: (res: any) => {
        this.batches = res?.data;
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  getFeaturesList() {
    this.http.getFeaturesList().subscribe({
      next: (res: any) => {
        this.features = res?.data;
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  getYearsFrom2022() {
    const startYear = 2022;
    const currentYear = new Date().getFullYear(); // Get the current year
    const years: number[] = [];

    for (let year = startYear; year <= currentYear; year++) {
      years.push(year);
    }

    this.yearsOptions = years;
  }

  selectedPerformance: any;
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  onClickPerformance(performance: any) {
    this.selectedPerformance = performance;

    if (this.selectedPerformance?.previousScoreObtained) {
      const current =
        Math.round(
          (this.selectedPerformance?.scoreObtained /
            this.selectedPerformance?.totalScore) *
            10000,
        ) / 100;

      const previous =
        Math.round(
          (this.selectedPerformance?.previousScoreObtained /
            this.selectedPerformance?.previousTotalScore) *
            10000,
        ) / 100;

      const difference = current - previous;

      this.selectedPerformance.scoreDifference =
        difference > 0 ? '+' + difference : difference;
    }

    this.performanceChartDatasets[0].data = [
      performance?.correct,
      performance?.incorrect,
      performance?.unattempted,
    ];
    this.chart?.update();
    this.isPerformanceModal = true;
  }

  getTestLeaderboard() {
    this.isLeaderboardVisible = !this.isLeaderboardVisible;

    if (!this.isLeaderboardVisible) {
      return;
    }

    if (!this.selectedPerformance) {
      this.message.error('Error! No test selected!');
      return;
    }

    const data = {
      testId: this.selectedPerformance?.testId,
      testType: this.selectedPerformance?.testType,
    };

    this.http.getTestLeaderboard(data).subscribe({
      next: (res: any) => {
        this.leaderboardData = res?.data;
      },
      error: (error: any) => {
        console.log(error);
        this.message?.error(error?.error?.message);
      },
    });
  }

  onModalClose() {
    this.isEditModal = false;
    this.isLeaderboardVisible = false;
    this.isPerformanceModal = false;
    this.selectedPerformance = null;
  }

  protected readonly performance = performance;
}
