import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../../../shared/services/http.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';
import { NzRadioComponent } from 'ng-zorro-antd/radio';

@Component({
  selector: 'app-test-attempt',
  templateUrl: './test-attempt.component.html',
  styleUrl: './test-attempt.component.scss',
})
export class TestAttemptComponent implements OnInit {
  countdownTime: any;

  testItemDetails: any;
  questions: any;

  isSubmitModal = false;

  constructor(
    private http: HttpService,
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
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

    // console.log(testId, testType, url);

    const data: any = {
      testId,
      testType,
    };

    this.http.postStartTest(data).subscribe({
      next: (res: any) => {
        this.testItemDetails = res?.data;
        this.countdownTime = new Date(res?.data?.stopTime).getTime();
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
      // Clear the answer if the same option is clicked
      this.questions[index].submittedAnswer = null;

      this.postSubmitAnswer(questionId, index, null); // Reset selection
    } else {
      // Set the selected option if a different one is clicked
      this.questions[index].submittedAnswer = selectedOption;
      this.postSubmitAnswer(questionId, index, selectedOption);
    }
  }

  @ViewChild('radioSelect') radioSelect: NzRadioComponent | undefined;
  postSubmitAnswer(questionId: number, index: number, value: string | null) {
    const data: any = {
      answerValue: value,
      questionId: questionId,
      testId: this.testItemDetails?.testId,
      testItemId: this.testItemDetails?.testItemId,
      testType: this.testItemDetails?.testType,
    };

    this.questions[index].submittedAnswer = value;

    // if (this.questions[index]?.submittedAnswer === value) {
    //   this.questions[index].submittedAnswer = null;
    //   data.answerValue = null;
    // } else {
    //   this.questions[index].submittedAnswer = value;
    // }

    console.log('value', value);
    console.log('index', this.questions[index]?.submittedAnswer);

    this.http.postSubmitAnswer(data).subscribe({
      next: (res: any) => {
        this.message.success('Successful! Answer submitted!');
      },
      error: (error: any) => {
        console.log(error);
        this.message?.error(error?.error?.message);
        // this.router.navigate(['/', 'student', 'home']);
      },
    });
  }

  onMarkForReview(index: number) {
    this.questions[index]['markForReview'] =
      !this.questions[index]['markForReview'];
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
        this.router.navigate(['/', 'student', 'home']);
      },
      error: (error: any) => {
        console.log(error);
        this.message?.error(error?.error?.message);
      },
    });
  }
}
