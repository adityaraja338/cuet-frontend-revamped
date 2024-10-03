import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from './http.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { StudentAuthService } from '../auth/student-auth.service';
import { Observable } from 'rxjs';

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
        // console.log('response', response);
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
              name: response?.data?.studentName,
              email: response?.data?.email,
              contact: response?.data?.phone?.split('-')[1],
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
    // console.log('paymentResult', paymentResult);
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

  initiateEnrollPayment(data: any): Observable<any> {
    return new Observable((observer) => {
      this.http.enrollInitiatePayment(data).subscribe({
        next: (response: any) => {
          if (response?.data?.paymentRequired) {
            const options = {
              key: 'rzp_test_xtHIdQfnQPITKE', // Enter the Key ID generated from the Dashboard
              amount: response.amount, // amount in the smallest currency unit
              currency: 'INR',
              name: 'Cuet Corner',
              description: 'Batch Enrollment Fee',
              order_id: response?.data?.order?.id, // This comes from the backend
              handler: (paymentResult: any) => {
                // After successful payment, verify payment
                this.verifyEnrollPayment(
                  paymentResult,
                  response?.data?.batchId,
                  response?.data?.studentId,
                  response?.data?.planType,
                ).subscribe({
                  next: (verificationResponse: any) => {
                    this.studentAuthService?.setTokens(
                      verificationResponse?.data?.accessToken,
                      verificationResponse?.data?.refreshToken,
                      verificationResponse?.data?.role,
                    );
                    this.message.success(
                      `Successful! Enrolled in ${verificationResponse.data?.batchName}!`,
                    );
                    observer.next(verificationResponse); // Notify the component
                    observer.complete(); // Complete the observable
                  },
                  error: (error: any) => {
                    this.message.error(error?.error?.message);
                    observer.error(error); // Notify the component about the error
                  },
                });
              },
              prefill: {
                name: response?.data?.studentName,
                email: response?.data?.email,
                contact: response?.data?.phone?.split('-')[1],
              },
              theme: {
                color: '#8555FD',
              },
            };

            const rzp = new Razorpay(options);
            rzp.open();
          } else {
            this.message.success(
              `Successful! Enrolled in ${response?.data?.batchName}!`,
            );
            observer.next(response);
            observer.complete();
          }
        },
        error: (error: any) => {
          this.message.error(error?.error?.message);
          observer.error(error); // Notify the component about the error
        },
      });
    });
  }

  verifyEnrollPayment(
    paymentResult: any,
    batchId: number,
    studentId: number,
    planType: string,
  ): Observable<any> {
    return this.http.verifyEnrollPayment({
      ...paymentResult,
      batchId,
      studentId,
      planType,
    });
  }

  initiateUpgradePayment(): Observable<any> {
    return new Observable((observer) => {
      this.http.upgradeInitiatePayment().subscribe({
        next: (response: any) => {
          if (response?.data?.paymentRequired) {
            const options = {
              key: 'rzp_test_xtHIdQfnQPITKE', // Enter the Key ID generated from the Dashboard
              amount: response.amount, // amount in the smallest currency unit
              currency: 'INR',
              name: 'Cuet Corner',
              description: 'Batch Upgrade Fee',
              order_id: response?.data?.order?.id, // This comes from the backend
              handler: (paymentResult: any) => {
                // After successful payment, verify payment
                this.verifyUpgradePayment(paymentResult).subscribe({
                  next: (verificationResponse: any) => {
                    this.message.success(
                      `Successful! Enrolled in ${verificationResponse.data?.batchName}!`,
                    );
                    observer.next(verificationResponse); // Notify the component
                    observer.complete(); // Complete the observable
                  },
                  error: (error: any) => {
                    this.message.error(error?.error?.message);
                    observer.error(error); // Notify the component about the error
                  },
                });
              },
              prefill: {
                name: response?.data?.studentName,
                email: response?.data?.email,
                contact: response?.data?.phone?.split('-')[1],
              },
              theme: {
                color: '#8555FD',
              },
            };

            const rzp = new Razorpay(options);
            rzp.open();
          } else {
            this.message.success(
              `Successful! Enrolled in ${response?.data?.batchName}!`,
            );
            observer.next(response);
            observer.complete();
          }
        },
        error: (error: any) => {
          this.message.error(error?.error?.message);
          observer.error(error); // Notify the component about the error
        },
      });
    });
  }

  verifyUpgradePayment(paymentResult: any): Observable<any> {
    return this.http.verifyUpgradePayment(paymentResult);
  }

  initiateFeaturePayment(data: any): Observable<any> {
    return new Observable((observer) => {
      this.http.purchaseFeatureInitiatePayment(data).subscribe({
        next: (response: any) => {
          if (response?.data?.paymentRequired) {
            const options = {
              key: 'rzp_test_xtHIdQfnQPITKE', // Enter the Key ID generated from the Dashboard
              amount: response.amount, // amount in the smallest currency unit
              currency: 'INR',
              name: 'Cuet Corner',
              description: 'Batch Upgrade Fee',
              order_id: response?.data?.order?.id, // This comes from the backend
              handler: (paymentResult: any) => {
                // After successful payment, verify payment
                this.verifyFeaturePayment(
                  paymentResult,
                  response?.data?.featureIds,
                ).subscribe({
                  next: (verificationResponse: any) => {
                    this.message.success(`Successful! Features purchased!`);
                    observer.next(verificationResponse); // Notify the component
                    observer.complete(); // Complete the observable
                  },
                  error: (error: any) => {
                    this.message.error(error?.error?.message);
                    observer.error(error); // Notify the component about the error
                  },
                });
              },
              prefill: {
                name: response?.data?.studentName,
                email: response?.data?.email,
                contact: response?.data?.phone?.split('-')[1],
              },
              theme: {
                color: '#8555FD',
              },
            };

            const rzp = new Razorpay(options);
            rzp.open();
          } else {
            this.message.success(`Successful! Features purchased!!`);
            observer.next(response);
            observer.complete();
          }
        },
        error: (error: any) => {
          this.message.error(error?.error?.message);
          observer.error(error); // Notify the component about the error
        },
      });
    });
  }

  verifyFeaturePayment(paymentResult: any, featureIds: any): Observable<any> {
    return this.http.verifyFeaturePayment({ ...paymentResult, featureIds });
  }
}
