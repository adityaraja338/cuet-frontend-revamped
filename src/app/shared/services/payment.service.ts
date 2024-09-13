import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from './http.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { StudentAuthService } from '../auth/student-auth.service';

declare var Razorpay: any;

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(
    private http: HttpService,
    private router: Router,
    private message: NzMessageService,
    private studentAuthService: StudentAuthService,
  ) {}

  initiateRegisterPayment(data: any) {
    this.http.registerAndInitiatePayment(data).subscribe({
      next: (response: any) => {
        console.log('response', response);
        if (response?.data?.paymentRequired) {
          const options = {
            key: 'rzp_test_xtHIdQfnQPITKE', // Enter the Key ID generated from the Dashboard
            amount: response.amount, // amount in the smallest currency unit
            currency: 'INR',
            name: 'Cuet Corner',
            description: 'Batch Enrollment Fee',
            order_id: response?.data?.order?.id, // This comes from the backend
            handler: (paymentResult: any) => {
              // Handle successful payment
              this.verifyRegisterPayment(
                paymentResult,
                response?.data?.batchId,
                response?.data?.studentId,
                response?.data?.planType,
              );
            },
            prefill: {
              name: 'Student Name',
              email: 'student@example.com',
              contact: '9304604081',
            },
            theme: {
              color: '#8555FD',
            },
          };

          const rzp = new Razorpay(options);
          rzp.open();
        } else {
          localStorage.setItem(
            'cuet_access_token',
            response?.data?.accessToken,
          );
          localStorage.setItem(
            'cuet_refresh_token',
            response?.data?.refreshToken,
          );
          localStorage.setItem('cuet_role', 'student');
          this.studentAuthService.login();
          this.message.success('Registration Successful!');
        }
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  verifyRegisterPayment(
    paymentResult: any,
    batchId: number,
    studentId: number,
    planType: string,
  ) {
    console.log('paymentResult', paymentResult);
    this.http
      .verifyRegisterPayment({ ...paymentResult, batchId, studentId, planType })
      .subscribe({
        next: (response: any) => {
          localStorage.setItem(
            'cuet_access_token',
            response?.data?.accessToken,
          );
          localStorage.setItem(
            'cuet_refresh_token',
            response?.data?.refreshToken,
          );
          localStorage.setItem('cuet_role', 'student');
          this.studentAuthService.login();
          this.message.success('Registration Successful!');
          // console.log('verified', response);
        },
        error: (error: any) => {
          console.log(error);
          this.message.error(error?.error?.message);
        },
      });
  }
}
