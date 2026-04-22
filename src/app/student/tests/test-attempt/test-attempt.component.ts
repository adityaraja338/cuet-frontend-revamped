import {
  Component,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpService } from '../../../shared/services/http.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { NzCarouselComponent } from 'ng-zorro-antd/carousel';

@Component({
  standalone: false,
  selector: 'app-test-attempt',
  templateUrl: './test-attempt.component.html',
  styleUrl: './test-attempt.component.scss',
})
export class TestAttemptComponent implements OnInit {
  countdownTime: any;

  testItemDetails: any;
  questions: any;

  currentSlideIndex = 0;
  paletteDrawerOpen = false;

  isSubmitModal = false;
  isPerformanceModal = false;

  @ViewChild('questionCarousel') questionCarousel: NzCarouselComponent | undefined;
  @ViewChild('mobileQuestionCarousel') mobileQuestionCarousel:
    | NzCarouselComponent
    | undefined;

  constructor(
    private http: HttpService,
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private readonly platformId: Object,
  ) {}

  ngOnInit() {
    this.postStartTest();
  }

  postStartTest() {
    const testId: any = this.route.snapshot.paramMap.get('testId');
    const url = this.router.url?.split('/');
    const testType = url[url.length - 2];

    if (
      !(
        testType &&
        !isNaN(testId) &&
        (testType === 'live' ||
          testType === 'recorded' ||
          testType === 'mock' ||
          testType === 'topic')
      )
    ) {
      this.message.error('Error! Invalid test!');
      this.router.navigate(['/', 'student', 'home']);
      return;
    }

    const data: any = {
      testId,
      testType,
    };

    this.http.postStartTest(data).subscribe({
      next: (res: any) => {
        this.testItemDetails = res?.data;
        if (isPlatformBrowser(this.platformId)) {
          this.countdownTime = new Date(res?.data?.stopTime).getTime();
        }
        this.getQuestions();
      },
      error: (error: any) => {
        console.log(error);
        this.message?.error(error?.error?.message);
        this.router.navigate(['/', 'student', 'home']);
      },
    });
  }

  getQuestions() {
    const data: any = {
      testId: this.testItemDetails?.testId,
      testItemId: this.testItemDetails?.testItemId,
      testType: this.testItemDetails?.testType,
    };

    this.http.getQuestions(data).subscribe({
      next: (res: any) => {
        this.questions = res?.data;
      },
      error: (error: any) => {
        console.log(error);
        this.message?.error(error?.error?.message);
        this.router.navigate(['/', 'student', 'home']);
      },
    });
  }

  onCheckboxClick(
    questionId: number,
    selectedOption: string,
    index: number,
  ): void {
    if (this.questions[index].submittedAnswer === selectedOption) {
      this.questions[index].submittedAnswer = null;
      this.postSubmitAnswer(questionId, index, null);
    } else {
      this.questions[index].submittedAnswer = selectedOption;
      this.postSubmitAnswer(questionId, index, selectedOption);
    }
  }

  postSubmitAnswer(questionId: number, index: number, value: string | null) {
    const data: any = {
      answerValue: value,
      questionId: questionId,
      testId: this.testItemDetails?.testId,
      testItemId: this.testItemDetails?.testItemId,
      testType: this.testItemDetails?.testType,
    };

    this.questions[index].submittedAnswer = value;

    this.http.postSubmitAnswer(data).subscribe({
      next: (res: any) => {
        this.message.success('Successful! Answer submitted!');
      },
      error: (error: any) => {
        console.log(error);
        this.message?.error(error?.error?.message);
      },
    });
  }

  onMarkForReview(index: number) {
    this.questions[index]['markForReview'] =
      !this.questions[index]['markForReview'];
  }

  onSlideChange(event: { from: number; to: number }) {
    this.currentSlideIndex = event?.to ?? 0;
  }

  goToQuestion(index: number) {
    this.currentSlideIndex = index;
    this.questionCarousel?.goTo(index);
    this.mobileQuestionCarousel?.goTo(index);
    this.paletteDrawerOpen = false;
  }

  goPrev() {
    this.questionCarousel?.pre();
    this.mobileQuestionCarousel?.pre();
  }

  goNext() {
    this.questionCarousel?.next();
    this.mobileQuestionCarousel?.next();
  }

  onCountdownFinish() {
    this.postSubmitTest();
  }

  postSubmitTest() {
    const data: any = {
      testId: this.testItemDetails?.testId,
      testItemId: this.testItemDetails?.testItemId,
      testType: this.testItemDetails?.testType,
    };

    this.http.postSubmitTest(data).subscribe({
      next: (res: any) => {
        this.message.success('Successful! Test submitted!');
        this.getPerformanceDetails(res?.data);
      },
      error: (error: any) => {
        console.log(error);
        this.message?.error(error?.error?.message);
      },
    });
  }

  testPerformance: any;
  doughnutChartLabels: string[] = [
    '# of Correct',
    '# of Incorrect',
    '# of Unattempted',
  ];
  performanceChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] =
    [
      {
        data: [0, 0, 0],
        backgroundColor: ['#004ac6', '#7c3aed', '#cbd5f5'],
        borderWidth: 4,
        borderRadius: 12,
      },
    ];
  doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: false,
    radius: 48,
    cutout: '78%',
  };
  isLeaderboardVisible = false;
  leaderboardData: any[] = [];
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  getPerformanceDetails(data: any) {
    this.http.getApi(`get-performance-details`, data).subscribe({
      next: (res: any) => {
        this.testPerformance = res?.data;

        this.performanceChartDatasets[0].data = [
          this.testPerformance?.correct,
          this.testPerformance?.incorrect,
          this.testPerformance?.unattempted,
        ];
        this.chart?.update();

        this.isPerformanceModal = true;
      },
      error: (error: any) => {
        console.log(error);
        this.message?.error(error?.error?.message);
      },
    });
  }

  getTestLeaderboard() {
    this.isLeaderboardVisible = !this.isLeaderboardVisible;

    if (!this.isLeaderboardVisible) {
      return;
    }

    if (!this.testPerformance) {
      this.message.error('Error! No test selected!');
      return;
    }

    const data = {
      testId: this.testPerformance?.testId,
      testType: this.testPerformance?.testType,
    };

    this.http.getTestLeaderboard(data).subscribe({
      next: (res: any) => {
        this.leaderboardData = res?.data;
      },
      error: (error: any) => {
        console.log(error);
        this.message?.error(error?.error?.message);
      },
    });
  }

  onModalClose() {
    this.isSubmitModal = false;
    this.isPerformanceModal = false;
    this.isLeaderboardVisible = false;
    this.router.navigate(['/', 'student', 'home']);
  }

  // ── Derived getters ────────────────────────────────────────────────

  get totalCount(): number {
    return this.questions?.length ?? 0;
  }

  get answeredCount(): number {
    if (!this.questions) return 0;
    return this.questions.filter(
      (q: any) => q?.submittedAnswer !== null && q?.submittedAnswer !== undefined,
    ).length;
  }

  get reviewCount(): number {
    if (!this.questions) return 0;
    return this.questions.filter((q: any) => q?.markForReview === true).length;
  }

  get unattemptedCount(): number {
    return Math.max(0, this.totalCount - this.answeredCount);
  }

  get progressPercent(): number {
    if (!this.totalCount) return 0;
    return Math.round((this.answeredCount / this.totalCount) * 100);
  }

  // ── Keyboard navigation ───────────────────────────────────────────

  @HostListener('document:keydown.arrowleft', ['$event'])
  onArrowLeft(event: Event) {
    if (this.isSubmitModal || this.isPerformanceModal) return;
    const target = event.target as HTMLElement | null;
    if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return;
    event.preventDefault();
    this.goPrev();
  }

  @HostListener('document:keydown.arrowright', ['$event'])
  onArrowRight(event: Event) {
    if (this.isSubmitModal || this.isPerformanceModal) return;
    const target = event.target as HTMLElement | null;
    if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return;
    event.preventDefault();
    this.goNext();
  }
}
