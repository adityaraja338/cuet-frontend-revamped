import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../shared/services/http.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent implements OnInit {
  profileForm: FormGroup;
  accountDetails: any;

  constructor(
    private http: HttpService,
    private message: NzMessageService,
    private formBuilder: FormBuilder,
  ) {
    this.profileForm = this.formBuilder.group({
      name: [{ value: null, disabled: true }],
      studentId: [{ value: null, disabled: true }],
      batchId: [{ value: null, disabled: true }],
      phone: [{ value: null, disabled: true }],
      email: [{ value: null, disabled: true }],
      age: [{ value: null, disabled: true }],
      cuetAttempts: [{ value: [], disabled: true }],
    });
  }

  ngOnInit() {
    this.getAccountDetails();
    this.getYearsFrom2022();
  }

  getAccountDetails() {
    this.http.getAccountDetails().subscribe({
      next: (res: any) => {
        this.accountDetails = res?.data;
        this.patchForm();
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  putImageUpdate() {
    const data = {
      imageUrl: null,
    };
    this.http.putImageUpdate(data).subscribe({
      next: (res: any) => {
        this.accountDetails.imageUrl = res?.data?.imageUrl;
        this.message.success('Profile image updated');
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  patchForm() {
    this.profileForm?.get('name')?.patchValue(this.accountDetails?.name);
    this.profileForm?.get('studentId')?.patchValue(this.accountDetails?.id);
    this.profileForm?.get('batchId')?.patchValue(this.accountDetails?.batchId);
    this.profileForm?.get('phone')?.patchValue(this.accountDetails?.phone);
    this.profileForm?.get('email')?.patchValue(this.accountDetails?.email);
    this.profileForm?.get('age')?.patchValue(this.accountDetails?.age);
    this.profileForm
      ?.get('cuetAttempts')
      ?.patchValue(this.accountDetails?.cuetAttempts);
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
}
