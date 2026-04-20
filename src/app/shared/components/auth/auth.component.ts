import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { GoogleAuthService } from '../../auth/google-auth.service';
import { OAuthService } from 'angular-oauth2-oidc';
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

export type AuthMode = 'student' | 'admin';

@Component({
  standalone: false,
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent implements OnInit, OnDestroy {
  registrationForm: FormGroup;
  loginTabIndex: number = 0;
  passwordVisible: boolean = false;
  authMode: AuthMode = 'student';

  adminEmail: string = '';
  adminPassword: string = '';
  yearsOptions: any;

  currentDate: Date = new Date();

  selectedBatch: any;
  batches: any = [];
  totalBatchCount = 0;

  features: any = [];
  featuresCount = 0;

  userData: any;
  dataSubscription?: Subscription;

  private previousRootClasses: string | null = null;

  constructor(
    private googleAuthService: GoogleAuthService,
    private oauthService: OAuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private payment: PaymentService,
    private message: NzMessageService,
    protected globalService: GlobalService,
    private http: HttpService,
    private adminHttp: AdminHttpService,
    private adminAuthService: AdminAuthService,
    private studentAuthService: StudentAuthService,
    @Inject(PLATFORM_ID) private readonly platformId: object,
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

  ngOnInit(): any {
    if (isPlatformBrowser(this.platformId)) {
      const root = document.documentElement;
      this.previousRootClasses = root.className;
      root.classList.remove('dark');
      if (!root.classList.contains('light')) root.classList.add('light');

      if (this.studentAuthService.isUserLoggedIn()) {
        this.router.navigate(['/', 'student', 'home']);
      }
      if (this.adminAuthService.isUserLoggedIn()) {
        this.router.navigate(['/', 'admin', 'home']);
      }
    }

    this.getYearsFrom2022();
    this.getBatches();
    this.getFeatures();

    this.dataSubscription = this.globalService.data$.subscribe(
      (receivedData: any) => {
        if (receivedData) {
          this.patchValues(receivedData);
        }
      },
    );
  }

  ngOnDestroy(): void {
    this.dataSubscription?.unsubscribe();
    this.dataSubscription = undefined;

    if (!isPlatformBrowser(this.platformId)) return;
    if (this.previousRootClasses !== null) {
      document.documentElement.className = this.previousRootClasses;
      this.previousRootClasses = null;
    }
  }

  getBatches() {
    this.http.getBatches().subscribe({
      next: (res: any) => {
        this.batches = res?.data?.batches;
        this.totalBatchCount = res?.data?.total;

        this.batches?.forEach((batch: any) => {
          batch.showDetails = false;
          batch.startDate = new Date(batch.startDate);
          batch.type = 'basic';
        });
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  getFeatures() {
    this.http.getFeatureList().subscribe({
      next: (res: any) => {
        this.features = res?.data?.features;
        this.featuresCount = res?.data?.total;
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  patchValues(data: any) {
    this.registrationForm?.get('googleUserId')?.patchValue(data?.googleUserId);
    this.registrationForm?.get('name')?.patchValue(data?.name);
    this.registrationForm?.get('email')?.patchValue(data?.email);
  }

  loginWithGoogle() {
    this.googleAuthService.loginWithGoogle();
  }

  goHome(event?: MouseEvent): void {
    if (event) {
      event.preventDefault();
    }
    this.router.navigate(['/']);
  }

  changeGoogleAccount(): void {
    try {
      this.oauthService.logOut(true);
    } catch {
      /* no-op: token may already be cleared */
    }

    this.registrationForm.reset({
      countryCode: 91,
      cuetAttempts: [],
      planType: 'basic',
    });
    this.selectedBatch = null;
    this.globalService.setData(null);

    if (this.globalService.isRegistrationPage) {
      this.globalService.toggleRegistrationPage();
    }

    this.message.info('Choose a different Google account to continue.');
  }

  setAuthMode(mode: AuthMode): void {
    if (this.authMode === mode) return;
    this.authMode = mode;
    this.loginTabIndex = mode === 'admin' ? 1 : 0;
  }

  onClickBatch(batch: any) {
    if (batch) {
      this.selectedBatch = batch;
      this.registrationForm?.get('batchId')?.patchValue(batch?.id);
    } else {
      this.selectedBatch = null;
      this.registrationForm?.get('batchId')?.patchValue(null);
    }
  }

  getYearsFrom2022() {
    const startYear = 2022;
    const currentYear = new Date().getFullYear();
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
      if (this.registrationForm?.get('batchId')?.value)
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
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('cuet_access_token', res.data.accessToken);
          localStorage.setItem('cuet_refresh_token', res.data.refreshToken);
          localStorage.setItem('cuet_role', 'admin');
        }
        this.adminAuthService.login();
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }
}
