import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminHttpService } from '../../shared/services/admin-http.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss',
})
export class StudentsComponent implements OnInit {
  students: any;

  batches: any;
  features: any;

  totalCount: number = 6;
  pageIndex: number = 1;
  pageSize: number = 30;
  searchValue: string = '';
  searchBatch: any;
  onlyFree = false;

  isLoading = false;

  isChangeBatchModal = false;
  changeBatchStudentId: number | undefined;
  currentStudentName: string | undefined = '';
  editBatchId: any;
  confirmEditBatchId: any;

  isDeleteBatchModal = false;
  isDeleteModal = false;
  deleteStudentId: number | undefined;
  deleteConfirmationText: string = '';

  isEditModal = false;
  editStudentDetails: any;
  editForm: FormGroup;

  constructor(
    private readonly router: Router,
    private readonly http: AdminHttpService,
    private readonly message: NzMessageService,
    private readonly formBuilder: FormBuilder,
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
    this.getStudents();
    this.getBatchList();
    this.getFeaturesList();
    this.getYearsFrom2022();
  }

  getStudents(event?: any) {
    this.isLoading = true;
    const data: any = {
      page: this.pageIndex,
      limit: this.pageSize,
    };

    if (event) {
      data['page'] = event?.pageIndex;
      data['limit'] = event?.pageSize;
      this.pageIndex = event?.pageIndex;
      this.pageSize = event?.pageSize;
    }

    if (this.searchValue) {
      data['search'] = this.searchValue;
    }

    if (this.searchBatch) {
      data['batchId'] = this.searchBatch;
    }

    if (this.onlyFree) {
      data['onlyFree'] = true;
    }

    this.http.getStudents(data).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.students = res?.data?.students;
        this.totalCount = res?.data?.total;
      },
      error: (error: any) => {
        this.isLoading = false;
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
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

  onChangeBatch() {
    const data: any = {
      studentId: this.changeBatchStudentId,
      batchId: this.editBatchId,
      confirmBatchId: this.confirmEditBatchId,
    };

    this.http.putEditStudentBatch(data).subscribe({
      next: (res: any) => {
        this.getStudents();
        this.message.success('Successful! Batch changed!');
        this.onModalClose();
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  patchForm() {
    this.editForm.reset();
    this.editForm?.get('studentId')?.patchValue(this.editStudentDetails?.id);
    this.editForm?.get('name')?.patchValue(this.editStudentDetails?.name);
    this.editForm?.get('batchId')?.patchValue(this.editStudentDetails?.batchId);
    this.editForm?.get('phone')?.patchValue(this.editStudentDetails?.phone);
    this.editForm?.get('email')?.patchValue(this.editStudentDetails?.email);
    this.editForm
      ?.get('imageUrl')
      ?.patchValue(this.editStudentDetails?.imageUrl);
    this.editForm?.get('age')?.patchValue(this.editStudentDetails?.age);
    this.editForm
      ?.get('cuetAttempts')
      ?.patchValue(this.editStudentDetails?.cuetAttempts);
    this.editForm
      ?.get('features')
      ?.patchValue(this.editStudentDetails?.individualFeatures);
  }

  onEditStudent() {
    if (this.editForm.valid) {
      const data: any = {
        studentId: this.editForm?.get('studentId')?.value,
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
          this.getStudents();
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

  onDeleteStudentBatch() {
    const data: any = {
      studentId: this.deleteStudentId,
    };

    this.http.deleteStudentBatch(data).subscribe({
      next: (res: any) => {
        this.getStudents();
        this.message.success('Successful! Student batch cleared!');
        this.onModalClose();
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  onDeleteStudent() {
    const data: any = {
      studentId: this.deleteStudentId,
    };

    this.http.deleteStudent(data).subscribe({
      next: (res: any) => {
        this.getStudents();
        this.message.success('Successful! Student deleted!');
        this.onModalClose();
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

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

  onModalClose() {
    this.currentStudentName = undefined;
    this.editBatchId = undefined;
    this.confirmEditBatchId = undefined;
    this.isChangeBatchModal = false;
    this.isEditModal = false;
    this.isDeleteModal = false;
    this.isDeleteBatchModal = false;
    this.deleteStudentId = undefined;
    this.deleteConfirmationText = '';
  }

  yearsOptions: any;
  getYearsFrom2022() {
    const startYear = 2022;
    const currentYear = new Date().getFullYear(); // Get the current year
    const years: number[] = [];

    for (let year = startYear; year <= currentYear; year++) {
      years.push(year);
    }

    this.yearsOptions = years;
  }

  protected readonly Math = Math;
}
