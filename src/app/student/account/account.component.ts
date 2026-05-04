import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../shared/services/http.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PaymentService } from '../../shared/services/payment.service';

@Component({
  standalone: false,
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
})
export class AccountComponent implements OnInit {
  profileForm: FormGroup;
  accountDetails: any;
  features: any = [];
  showPurchaseButton = false;
  totalPurchaseAmount = 0;

  isShowBatches = false;
  batches: any = [];
  totalBatchCount = 0;
  currentDate: Date = new Date();
  private getDemoBatches(): any[] {
    const today = new Date();
    const d = (daysFromNow: number) =>
      new Date(today.getTime() + daysFromNow * 24 * 60 * 60 * 1000);

    return [
      {
        id: -101,
        name: 'Foundation',
        startDate: d(6),
        basePrice: 999,
        premiumPrice: 1999,
        baseFeatures: [],
        type: 'basic',
        showDetails: false,
        isDemo: true,
      },
      {
        id: -102,
        name: 'Sprint',
        startDate: d(13),
        basePrice: 1499,
        premiumPrice: 2499,
        baseFeatures: [],
        type: 'basic',
        showDetails: false,
        isDemo: true,
      },
      {
        id: -103,
        name: 'Final Push',
        startDate: d(21),
        basePrice: 1999,
        premiumPrice: 2999,
        baseFeatures: [],
        type: 'basic',
        showDetails: false,
        isDemo: true,
      },
    ];
  }

  constructor(
    private http: HttpService,
    private message: NzMessageService,
    private formBuilder: FormBuilder,
    private readonly payment: PaymentService,
  ) {
    this.profileForm = this.formBuilder.group({
      name: [{ value: null, disabled: true }],
      studentId: [{ value: null, disabled: true }],
      batchName: [{ value: null, disabled: true }],
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
        if (!res?.data?.isPremium) {
          this.getFeaturesList();
          if (!res?.data?.isUpgradeable) {
            this.getBatches();
          }
        }
        this.patchForm();
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  getFeaturesList() {
    this.http.getAccountFeatures().subscribe({
      next: (res: any) => {
        this.features = res?.data?.features;
        this.features?.forEach((feature: any) => {
          feature.selectedToBuy = !feature?.canPurchase;
        });
        this.isFeatureSelectedToBuy();
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  getBatches() {
    this.http.getAccountBatches().subscribe({
      next: (res: any) => {
        this.batches = res?.data?.batches;
        this.totalBatchCount = res?.data?.total;

        if (!this.batches?.length) {
          this.batches = this.getDemoBatches();
          this.totalBatchCount = this.batches.length;
        }

        this.batches?.forEach((batch: any) => {
          batch.showDetails = false;
          batch.startDate = new Date(batch.startDate);
          batch.type = 'basic';
        });
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);

        // Fallback demo batches so the UI can still be reviewed.
        this.batches = this.getDemoBatches();
        this.totalBatchCount = this.batches.length;
      },
    });
  }

  closeAllCollapse() {
    this.batches?.forEach((batch: any) => (batch.showDetails = false));
  }

  isFeatureSelectedToBuy() {
    const selectedFeatures = this.features?.filter(
      (feature: any) => feature?.selectedToBuy && feature?.canPurchase,
    );
    this.showPurchaseButton = selectedFeatures?.length > 0;
    this.totalPurchaseAmount = selectedFeatures?.reduce(
      (accumulator: any, currentValue: any) =>
        accumulator + currentValue?.price,
      0,
    );
  }

  putImageUpdate(url: string) {
    const data = {
      imageUrl: url,
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
    this.profileForm
      ?.get('batchName')
      ?.patchValue(this.accountDetails?.batchName);
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

  onInitiateEnrollPayment(batchId: number, planType: string): void {
    const data: any = {
      batchId,
      planType,
    };

    this.payment?.initiateEnrollPayment(data).subscribe({
      next: (response: any) => {
        // console.log('Payment and enrollment successful:', response);
        // Make additional API calls or perform other actions here
        this.getAccountDetails();
        this.isShowBatches = false;
      },
      error: (error: any) => {
        console.log('Payment failed or enrollment failed:', error);
      },
    });
  }

  onInitiateUpgradePayment(): void {
    const data: any = {
      batchId: 2,
      planType: 'basic',
    };

    this.payment?.initiateUpgradePayment().subscribe({
      next: (response: any) => {
        // console.log('Payment and enrollment successful:', response);
        // Make additional API calls or perform other actions here
        this.getAccountDetails();
      },
      error: (error: any) => {
        console.log('Payment failed or enrollment failed:', error);
      },
    });
  }

  onInitiateFeaturePayment(): void {
    const featureIds = this.features
      .filter((feature: any) => feature?.selectedToBuy && feature?.canPurchase)
      .map((filteredFeatures: any) => filteredFeatures.id);

    const data: any = {
      featureIds,
    };

    this.payment?.initiateFeaturePayment(data).subscribe({
      next: (response: any) => {
        // console.log('Payment and enrollment successful:', response);
        // Make additional API calls or perform other actions here
        this.getAccountDetails();
        this.getFeaturesList();
      },
      error: (error: any) => {
        console.log('Payment failed or enrollment failed:', error);
      },
    });
  }
}
