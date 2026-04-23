import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminHttpService } from '../../shared/services/admin-http.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { GlobalService } from '../../shared/services/global.service';

@Component({
  standalone: false,
  selector: 'app-batches',
  templateUrl: './batches.component.html',
  styleUrl: './batches.component.css',
})
export class BatchesComponent implements OnInit {
  batches: any;

  collapseFilter: boolean = false;
  totalBatchCount = 0;
  pageIndex = 1;
  pageSize = 30;
  features: any;

  isLoading = false;
  searchBatch: string = '';
  previousSearchBatch: string = '';

  isDeleteModal = false;
  deleteConfirmationText: string = '';
  deleteBatchId: number | undefined;

  isCreateEditModal = false;
  createEditBatchForm: FormGroup;
  editModalDetails: any;

  constructor(
    private readonly router: Router,
    private http: AdminHttpService,
    private message: NzMessageService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    protected readonly globalService: GlobalService,
  ) {
    this.createEditBatchForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.maxLength(40)]],
      description: [null, [Validators.required, Validators.maxLength(120)]],
      startDate: [null, [Validators.required]],
      entryAllowed: [false, [Validators.required]],
      features: [[], [Validators.required]],
      basePrice: [null, [Validators.required, Validators.pattern(/^\d*$/)]],
      upgradePrice: [null, [Validators.required, Validators.pattern(/^\d*$/)]],
      premiumPrice: [null, [Validators.required, Validators.pattern(/^\d*$/)]],
      batchId: [null, [Validators.pattern(/^\d*$/)]],
    });
  }

  ngOnInit() {
    this.getBatches();
    this.getFeaturesList();
  }

  getBatches(event?: any) {
    this.isLoading = true;

    const data: any = {
      page: this.pageIndex,
      limit: this.pageSize,
    };

    if (event) {
      data['page'] = event.pageIndex;
      data['limit'] = event.pageSize;
      this.pageIndex = event.pageIndex;
      this.pageSize = event.pageSize;
    }

    if (this.searchBatch) {
      data['search'] = this.searchBatch;
    }

    this.http.getBatches(data).subscribe({
      next: (res: any) => {
        this.batches = res?.data?.batches;
        this.totalBatchCount = res?.data?.total;
        this.isLoading = false;
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

  getBatchInfo(batchId: any) {
    const data = {
      batchId,
    };
    this.http.getBatchInfo(data).subscribe({
      next: (res: any) => {
        this.createEditBatchForm.reset();
        this.editModalDetails = res?.data;
        this.patchForm();
        this.isCreateEditModal = true;
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  patchForm() {
    this.createEditBatchForm
      ?.get('name')
      ?.patchValue(this.editModalDetails?.name);
    this.createEditBatchForm
      ?.get('batchId')
      ?.patchValue(this.editModalDetails?.id);
    this.createEditBatchForm
      ?.get('description')
      ?.patchValue(this.editModalDetails?.description);
    this.createEditBatchForm
      ?.get('startDate')
      ?.patchValue(new Date(this.editModalDetails?.startDate));
    this.createEditBatchForm
      ?.get('entryAllowed')
      ?.patchValue(this.editModalDetails?.entryAllowed);
    this.createEditBatchForm
      ?.get('features')
      ?.patchValue(this.editModalDetails?.baseFeatures);
    this.createEditBatchForm
      ?.get('basePrice')
      ?.patchValue(this.editModalDetails?.basePrice);
    this.createEditBatchForm
      ?.get('premiumPrice')
      ?.patchValue(this.editModalDetails?.premiumPrice);
    this.createEditBatchForm
      ?.get('upgradePrice')
      ?.patchValue(this.editModalDetails?.upgradePrice);
  }

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

  onCreateBatch() {
    if (this.createEditBatchForm.valid) {
      // console.log(this.createEditBatchForm);
      const payload: any = {};

      payload['batchName'] = this.createEditBatchForm?.get('name')?.value;
      payload['description'] =
        this.createEditBatchForm?.get('description')?.value;
      payload['startDate'] = this.createEditBatchForm
        ?.get('startDate')
        ?.value?.toISOString();
      payload['entryAllowed'] =
        this.createEditBatchForm?.get('entryAllowed')?.value;
      payload['featureIds'] = this.createEditBatchForm?.get('features')?.value;
      payload['basePrice'] = +this.createEditBatchForm?.get('basePrice')?.value;
      payload['upgradePrice'] =
        +this.createEditBatchForm?.get('upgradePrice')?.value;
      payload['premiumPrice'] =
        +this.createEditBatchForm?.get('premiumPrice')?.value;

      this.http.postCreateBatch(payload).subscribe({
        next: (res: any) => {
          this.message.success('Successful! Batch created!');
          this.isCreateEditModal = false;
          this.editModalDetails = null;
          this.createEditBatchForm.reset();
          this.getBatches();
        },
        error: (error: any) => {
          console.log(error);
          this.message.error(error?.error?.message);
        },
      });
    } else {
      this.message.error('Marked fields are mandatory!');
      Object.keys(this.createEditBatchForm.controls).forEach((field) => {
        const control = this.createEditBatchForm?.get(field);
        if (control instanceof FormControl) {
          control.markAsDirty({ onlySelf: true });
          control.updateValueAndValidity({ onlySelf: true });
          control.markAsTouched({ onlySelf: true });
        }
      });
    }
  }

  onEditBatch() {
    if (this.createEditBatchForm.valid) {
      // console.log(this.createEditBatchForm);
      const payload: any = {};

      payload['batchId'] = this.createEditBatchForm?.get('batchId')?.value;
      payload['batchName'] = this.createEditBatchForm?.get('name')?.value;
      payload['description'] =
        this.createEditBatchForm?.get('description')?.value;
      payload['startDate'] = this.createEditBatchForm
        ?.get('startDate')
        ?.value?.toISOString();
      payload['entryAllowed'] =
        this.createEditBatchForm?.get('entryAllowed')?.value;
      payload['featureIds'] = this.createEditBatchForm?.get('features')?.value;
      payload['basePrice'] = +this.createEditBatchForm?.get('basePrice')?.value;
      payload['upgradePrice'] =
        +this.createEditBatchForm?.get('upgradePrice')?.value;
      payload['premiumPrice'] =
        +this.createEditBatchForm?.get('premiumPrice')?.value;

      this.http.putEditBatch(payload).subscribe({
        next: (res: any) => {
          this.message.success('Successful! Batch edited!');
          this.onCloseCreateEditModal();
          this.getBatches();
        },
        error: (error: any) => {
          console.log(error);
          this.message.error(error?.error?.message);
        },
      });
    } else {
      this.message.error('Marked fields are mandatory!');
      Object.keys(this.createEditBatchForm.controls).forEach((field) => {
        const control = this.createEditBatchForm?.get(field);
        if (control instanceof FormControl) {
          control.markAsDirty({ onlySelf: true });
          control.updateValueAndValidity({ onlySelf: true });
          control.markAsTouched({ onlySelf: true });
        }
      });
    }
  }

  onCloseCreateEditModal() {
    this.isCreateEditModal = false;
    this.deleteBatchId = undefined;
    this.editModalDetails = undefined;
    this.createEditBatchForm.reset();
  }

  onOpenDeleteModal(deleteBatchId: any) {
    this.deleteBatchId = deleteBatchId;
    this.isDeleteModal = true;
  }

  onDeleteBatch() {
    if (this.deleteConfirmationText !== 'DELETE') {
      this.message.error('Error! Please type correctly!');
      return;
    }

    this.http.deleteBatch({ batchId: this.deleteBatchId }).subscribe({
      next: (res: any) => {
        this.getBatches();
        this.message.success('Successful! Batch deleted!');
        this.isDeleteModal = false;
        this.deleteConfirmationText = '';
        this.deleteBatchId = undefined;
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  onChangeEntry(batchId: any, status: boolean) {
    const data = {
      batchId,
      entryAllowed: status,
    };

    this.http.putChangeEntry(data).subscribe({
      next: (res: any) => {
        this.message.success('Successful! Batch entry updated!');
        this.getBatches();
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  protected readonly Math = Math;
}
