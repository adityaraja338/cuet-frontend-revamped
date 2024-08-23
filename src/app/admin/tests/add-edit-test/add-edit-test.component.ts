import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';

import * as Papa from 'papaparse';

@Component({
  selector: 'app-add-edit-test',
  templateUrl: './add-edit-test.component.html',
  styleUrl: './add-edit-test.component.scss',
})
export class AddEditTestComponent implements OnInit {
  testForm: FormGroup;

  hoursList: number[] = Array.from({ length: 24 }, (_, i) => i);
  minutesList: number[] = Array.from({ length: 60 }, (_, i) => i);

  viewQuestions: boolean = true;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly message: NzMessageService,
  ) {
    this.testForm = this.formBuilder.group({
      testType: ['live', Validators.required],
      testName: [null, Validators.required],
      subjectName: [null],
      topics: [[]],
      durationHour: [null, Validators.required],
      durationMinutes: [null, Validators.required],
      startDate: [null],
      startTime: [null],
      endDate: [null],
      endTime: [null],
      isFree: [false, Validators.required],
      batchIds: [null],
      topicId: [null],
      questions: this.formBuilder.array([]),
    });

    this.testForm?.get('testType')?.valueChanges.subscribe((value) => {
      this.setTestFormValidation(value);
    });

    this.setTestFormValidation('live');
    this.addQuestion();
  }

  ngOnInit() {}

  get questions() {
    return this.testForm?.get('questions') as FormArray;
  }

  addQuestion(question?: {
    question: string;
    correct: string;
    incorrect1: string;
    incorrect2: string;
    incorrect3: string;
    incorrect4?: string;
  }): any {
    const previousControl = this.questions.at(this.questions.length - 1);

    if (!question && previousControl?.invalid) {
      return this.message.error('Please enter question details before adding!');
    }

    const questionControl = this.formBuilder.group({
      question: [question?.question ?? null, Validators.required],
      correctOption: [question?.correct ?? null, Validators.required],
      incorrectOption1: [question?.incorrect1 ?? null, Validators.required],
      incorrectOption2: [question?.incorrect2 ?? null, Validators.required],
      incorrectOption3: [question?.incorrect3 ?? null, Validators.required],
      incorrectOption4: [question?.incorrect4 ?? null],
    });

    this.questions.push(questionControl);
  }

  saveQuestion(index: number) {}

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  beforeUpload = (file: NzUploadFile, fileList: NzUploadFile[]): boolean => {
    // this.readFileContent(file);
    // console.log('file', file);
    // console.log('fileList', fileList);
    if (file?.type !== 'text/csv') {
      this.message.error('Please select a CSV File!');
    } else {
      this.readCsvFile(file as unknown as File);
    }
    return false; // Prevent actual upload
  };

  handleFileSelect = (NzUploadXHRArgs: any): any => {
    // No action needed, as the upload is handled by beforeUpload
  };

  readCsvFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const csv = event.target.result;
      Papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          this.addCSVQuestions(result?.data);
        },
      });
    };
    reader.readAsText(file);
  }

  addCSVQuestions(questions: any) {
    console.log(questions);
    // while (this.questions.length !== 0) {
    //   this.questions.removeAt(0);
    // }
    this.questions.clear();
    questions?.forEach((question: any) => {
      this.addQuestion({
        question: question?.question,
        correct: question?.correctOption,
        incorrect1: question?.option2,
        incorrect2: question?.option3,
        incorrect3: question?.option4,
        incorrect4: question?.option5,
      });
    });
  }

  private setTestFormValidation(testType: string): void {
    const subjectControl = this.testForm?.get('subjectName');
    const topicsControl = this.testForm?.get('topics');
    const startDateControl = this.testForm?.get('startDate');
    const startTimeControl = this.testForm?.get('startTime');
    const endDateControl = this.testForm?.get('endDate');
    const endTimeControl = this.testForm?.get('endTime');
    const batchIdControl = this.testForm?.get('batchIds');
    const topicIdControl = this.testForm?.get('topicId');
    if (testType === 'live') {
      subjectControl?.setValidators([Validators.required]);
      topicsControl?.setValidators([Validators.required]);
      startDateControl?.setValidators([Validators.required]);
      startTimeControl?.setValidators([Validators.required]);
      endDateControl?.setValidators([Validators.required]);
      endTimeControl?.setValidators([Validators.required]);
      if (!this.testForm?.get('isFree')?.value) {
        batchIdControl?.setValidators([Validators.required]);
      } else {
        batchIdControl?.clearValidators();
      }
      topicIdControl?.clearValidators();
    } else if (testType === 'mock') {
      subjectControl?.setValidators([Validators.required]);
      topicsControl?.setValidators([Validators.required]);
      startDateControl?.clearValidators();
      startTimeControl?.clearValidators();
      endDateControl?.clearValidators();
      endTimeControl?.clearValidators();
      batchIdControl?.clearValidators();
      topicIdControl?.clearValidators();
    } else {
      if (this.testForm?.get('testType')?.value !== 'topic') {
        this.testForm?.get('testType')?.patchValue('topic');
      }
      subjectControl?.clearValidators();
      topicsControl?.clearValidators();
      startDateControl?.clearValidators();
      startTimeControl?.clearValidators();
      endDateControl?.clearValidators();
      endTimeControl?.clearValidators();
      batchIdControl?.clearValidators();
      topicIdControl?.setValidators([Validators.required]);
    }
    subjectControl?.updateValueAndValidity();
    topicsControl?.updateValueAndValidity();
    startDateControl?.updateValueAndValidity();
    startTimeControl?.updateValueAndValidity();
    endDateControl?.updateValueAndValidity();
    endTimeControl?.updateValueAndValidity();
    batchIdControl?.updateValueAndValidity();
    topicIdControl?.updateValueAndValidity();
  }

  onIsFreeChange(isFree: boolean) {
    if (this.testForm?.get('testType')?.value === 'live') {
      if (isFree) {
        this.testForm?.get('batchIds')?.clearValidators();
      } else {
        this.testForm?.get('batchIds')?.setValidators([Validators.required]);
      }
    }
  }
}
