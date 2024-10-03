import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AdminHttpService } from '../../../shared/services/admin-http.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { GlobalService } from '../../../shared/services/global.service';

@Component({
  selector: 'app-batch-detail',
  templateUrl: './batch-detail.component.html',
  styleUrl: './batch-detail.component.scss',
})
export class BatchDetailComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

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

  batchId: number | undefined;
  editBatchForm: FormGroup;
  editModalDetails: any;
  batchFeatures: any;
  studentList: any;
  isEditModal = false;
  features: any;

  isLoading = false;

  constructor(
    private http: AdminHttpService,
    private message: NzMessageService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    protected readonly globalService: GlobalService,
  ) {
    this.editBatchForm = this.formBuilder.group({
      batchId: [{ value: null, disabled: true }, [Validators.pattern(/^\d*$/)]],
      name: [null, [Validators.required, Validators.maxLength(40)]],
      description: [null, [Validators.required, Validators.maxLength(120)]],
      startDate: [null, [Validators.required]],
      entryAllowed: [false, [Validators.required]],
      features: [[], [Validators.required]],
      basePrice: [null, [Validators.required, Validators.pattern(/^\d*$/)]],
      upgradePrice: [null, [Validators.required, Validators.pattern(/^\d*$/)]],
      premiumPrice: [null, [Validators.required, Validators.pattern(/^\d*$/)]],
    });
  }

  ngOnInit() {
    this.batchId = Number(this.route.snapshot.paramMap.get('batchId'));

    if (isNaN(this.batchId)) {
      this.message.error('Error! Invalid Batch ID!');
      this.router.navigate(['/', 'admin', 'batches']);
    } else {
      this.getBatchDetails();
    }

    this.getFeaturesList();
  }

  getBatchDetails() {
    this.isLoading = true;
    this.http.getBatchDetails({ batchId: this.batchId }).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.editModalDetails = res?.data?.details;
        this.batchFeatures = res?.data?.details?.features?.map(
          (feature: any) => feature.name,
        );
        this.studentList = res?.data?.students;
        this.doughnutChartDatasets[0].data = [
          res?.data?.details?.studentOver50,
          res?.data?.details?.studentBelow50,
        ];
        this.chart?.update();
      },
      error: (error: any) => {
        this.isLoading = false;
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

  onClickEditBatch() {
    this.patchForm();
    this.isEditModal = true;
  }

  patchForm() {
    const features = this.editModalDetails?.features?.map(
      (feature: any) => feature.id,
    );

    this.editBatchForm
      ?.get('batchId')
      ?.patchValue(this.editModalDetails?.batchId);
    this.editBatchForm
      ?.get('name')
      ?.patchValue(this.editModalDetails?.batchName);
    this.editBatchForm
      ?.get('description')
      ?.patchValue(this.editModalDetails?.description);
    this.editBatchForm
      ?.get('startDate')
      ?.patchValue(new Date(this.editModalDetails?.startDate));
    this.editBatchForm
      ?.get('entryAllowed')
      ?.patchValue(this.editModalDetails?.entryAllowed);
    this.editBatchForm?.get('features')?.patchValue(features);
    this.editBatchForm
      ?.get('basePrice')
      ?.patchValue(this.editModalDetails?.basePrice);
    this.editBatchForm
      ?.get('premiumPrice')
      ?.patchValue(this.editModalDetails?.premiumPrice);
    this.editBatchForm
      ?.get('upgradePrice')
      ?.patchValue(this.editModalDetails?.upgradePrice);
  }

  onEditBatch() {
    if (this.editBatchForm.valid) {
      // console.log(this.editBatchForm);
      const payload: any = {};

      payload['batchId'] = this.editBatchForm?.get('batchId')?.value;
      payload['batchName'] = this.editBatchForm?.get('name')?.value;
      payload['description'] = this.editBatchForm?.get('description')?.value;
      payload['startDate'] = this.editBatchForm
        ?.get('startDate')
        ?.value?.toISOString();
      payload['entryAllowed'] = this.editBatchForm?.get('entryAllowed')?.value;
      payload['featureIds'] = this.editBatchForm?.get('features')?.value;
      payload['basePrice'] = +this.editBatchForm?.get('basePrice')?.value;
      payload['upgradePrice'] = +this.editBatchForm?.get('upgradePrice')?.value;
      payload['premiumPrice'] = +this.editBatchForm?.get('premiumPrice')?.value;

      this.http.putEditBatch(payload).subscribe({
        next: (res: any) => {
          this.message.success('Successful! Batch edited!');
          this.onCloseEditModal();
          this.getBatchDetails();
        },
        error: (error: any) => {
          console.log(error);
          this.message.error(error?.error?.message);
        },
      });
    } else {
      this.message.error('Marked fields are mandatory!');
      Object.keys(this.editBatchForm.controls).forEach((field) => {
        const control = this.editBatchForm?.get(field);
        if (control instanceof FormControl) {
          control.markAsDirty({ onlySelf: true });
          control.updateValueAndValidity({ onlySelf: true });
          control.markAsTouched({ onlySelf: true });
        }
      });
    }
  }

  onCloseEditModal() {
    this.isEditModal = false;
    this.editBatchForm.reset();
  }
}
