import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AuthComponent } from './auth.component';
import { HttpService } from '../../services/http.service';
import { AdminHttpService } from '../../services/admin-http.service';
import { StudentAuthService } from '../../auth/student-auth.service';
import { AdminAuthService } from '../../auth/admin-auth.service';
import { GoogleAuthService } from '../../auth/google-auth.service';
import { PaymentService } from '../../services/payment.service';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: HttpService,
          useValue: {
            getBatches: () => of({ data: { batches: [], total: 0 } }),
            getFeatureList: () => of({ data: { features: [], total: 0 } }),
          },
        },
        {
          provide: AdminHttpService,
          useValue: { postAdminLogin: () => of({ data: {} }) },
        },
        {
          provide: StudentAuthService,
          useValue: { isUserLoggedIn: () => false },
        },
        {
          provide: AdminAuthService,
          useValue: { isUserLoggedIn: () => false, login: () => undefined },
        },
        { provide: GoogleAuthService, useValue: { loginWithGoogle: () => undefined } },
        { provide: PaymentService, useValue: { initiateRegisterPayment: () => undefined } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
