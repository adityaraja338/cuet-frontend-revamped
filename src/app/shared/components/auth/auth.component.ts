import { Component, OnInit } from '@angular/core';
import { GoogleAuthService } from '../../auth/google-auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentAuthService } from '../../auth/student-auth.service';
import { AdminAuthService } from '../../auth/admin-auth.service';
import { Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { GlobalService } from '../../services/global.service';
import { Subscription } from 'rxjs';
import { HttpService } from '../../services/http.service';
import { AdminHttpService } from '../../services/admin-http.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent implements OnInit {
  registrationForm: FormGroup;
  loginTabIndex: number = 0;
  passwordVisible: boolean = false;

  adminEmail: string = '';
  adminPassword: string = '';

  features: any = [
    { name: 'Live Test', included: true },
    { name: 'Mock Test', included: true },
    { name: 'Topic-wise Test', included: false },
    { name: 'Newspaper', included: false },
    { name: 'PYQ', included: true },
    { name: 'Materials', included: true },
    { name: 'Video Lectures', included: true },
  ];

  constructor(
    private googleAuthService: GoogleAuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private payment: PaymentService,
    private message: NzMessageService,
    protected globalService: GlobalService,
    private http: HttpService,
    private adminHttp: AdminHttpService,
    private adminAuthService: AdminAuthService,
    private studentAuthService: StudentAuthService,
  ) {
    this.registrationForm = this.formBuilder.group({
      googleUserId: [null, [Validators.required]],
      name: [null, [Validators.required]],
      email: [
        { value: null, disabled: true },
        [Validators.email, Validators.required],
      ],
      countryCode: [
        91,
        [Validators.required, Validators.minLength(1), Validators.maxLength(4)],
      ],
      phone: [null, [Validators.required, Validators.pattern(/^\d{10,15}$/)]],
      age: [
        null,
        [Validators.required, Validators.pattern(/^(1[2-9]|[2-9][0-9]+)$/)],
      ],
      cuetAttempts: [[]],
      batchId: [null],
      planType: ['basic'],
    });
  }

  userData: any;
  dataSubscription!: Subscription;
  ngOnInit(): any {
    if (this.studentAuthService.isUserLoggedIn()) {
      this.router.navigate(['/', 'student', 'home']);
    }
    if (this.adminAuthService.isUserLoggedIn()) {
      this.router.navigate(['/', 'admin', 'home']);
    }
    this.getYearsFrom2022();
    // console.log('student data', this.globalService.studentTempData);
    this.dataSubscription = this.globalService.data$.subscribe(
      (receivedData: any) => {
        if (receivedData) {
          this.patchValues(receivedData);
          // You can now use this data in the component, e.g., display it in the template
        }
      },
    );
  }

  patchValues(data: any) {
    this.registrationForm?.get('googleUserId')?.patchValue(data?.googleUserId);
    this.registrationForm?.get('name')?.patchValue(data?.name);
    this.registrationForm?.get('email')?.patchValue(data?.email);
  }

  loginWithGoogle() {
    // This will redirect the user to Google for login
    this.googleAuthService.loginWithGoogle();
  }

  onClickBatch(batchId: number | null) {
    this.registrationForm?.get('batchId')?.patchValue(batchId);
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

  registerBatch() {
    if (this.registrationForm.valid) {
      const data: any = {};
      data['googleUserId'] = this.registrationForm?.get('googleUserId')?.value;
      data['name'] = this.registrationForm?.get('name')?.value;
      data['countryCode'] = this.registrationForm?.get('countryCode')?.value;
      data['phone'] = this.registrationForm?.get('phone')?.value;
      data['age'] = this.registrationForm?.get('age')?.value;
      data['cuetAttempts'] = this.registrationForm?.get('cuetAttempts')?.value;
      data['batchId'] = this.registrationForm?.get('batchId')?.value;
      data['planType'] = this.registrationForm?.get('planType')?.value;
      this.payment.initiateRegisterPayment(data);
    } else {
      console.log(this.registrationForm);
      Object.keys(this.registrationForm.controls).forEach((control) => {
        this.registrationForm?.get(control)?.markAsTouched();
        this.registrationForm?.get(control)?.markAsDirty();
        this.registrationForm?.updateValueAndValidity();
      });
      this.message.error('Marked fields are mandatory!');
    }
  }

  adminLogin() {
    const data = {
      email: this.adminEmail,
      password: this.adminPassword,
    };
    this.adminHttp.postAdminLogin(data).subscribe({
      next: (res: any) => {
        localStorage.setItem('cuet_access_token', res.data.accessToken);
        localStorage.setItem('cuet_refresh_token', res.data.refreshToken);
        localStorage.setItem('cuet_role', 'admin');
        // localStorage.setItem('cuet_admin_name', res.data.adminName);
        this.adminAuthService.login();
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }
}
