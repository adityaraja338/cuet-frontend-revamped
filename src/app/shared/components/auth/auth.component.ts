import { Component, OnInit } from '@angular/core';
import { GoogleAuthService } from '../../auth/google-auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentAuthService } from '../../auth/student-auth.service';
import { AdminAuthService } from '../../auth/admin-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent implements OnInit {
  registrationForm: FormGroup;
  loginTabIndex: number = 0;
  passwordVisible: boolean = false;

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
    private studentAuthService: StudentAuthService,
    private adminAuthService: AdminAuthService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.registrationForm = this.formBuilder.group({
      name: ['John Doe', [Validators.required]],
      email: ['kissme@gmail.com', [Validators.email, Validators.required]],
      countryCode: [91, [Validators.required]],
      phone: [
        null,
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(12),
        ],
      ],
      age: [null, [Validators.required]],
      batchId: [null],
      planType: ['basic'],
    });
  }

  userData: any;
  ngOnInit(): any {}

  loginWithGoogle() {
    // This will redirect the user to Google for login
    this.googleAuthService.loginWithGoogle();
  }

  onClickBatch(batchId: number | null) {
    this.registrationForm?.get('batchId')?.patchValue(batchId);
  }

  isRegistering = false;
  toggleView() {
    this.isRegistering = !this.isRegistering;
  }
}
