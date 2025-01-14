import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';

import * as Papa from 'papaparse';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminHttpService } from '../../../shared/services/admin-http.service';

@Component({
  selector: 'app-add-edit-test',
  templateUrl: './add-edit-test.component.html',
  styleUrl: './add-edit-test.component.scss',
})
export class AddEditTestComponent implements OnInit {
  testForm: FormGroup;

  isEditMode: boolean = false;

  hoursList: number[] = Array.from({ length: 24 }, (_, i) => i);
  minutesList: number[] = Array.from({ length: 60 }, (_, i) => i);

  viewQuestions: boolean = true;

  isLoading = false;
  testDetails: any;

  isQuestionLoading = false;
  testId: any;
  testType: any;
  testQuestions: any;

  subjects: any;
  topics: any;
  batches: any;

  isDeleteQuestionModal = false;
  editQuestionId: any;
  deleteQuestionId: any;

  isSaveTestModal = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly message: NzMessageService,
    private readonly http: AdminHttpService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    this.testForm = this.formBuilder.group({
      testType: ['live', !this.isEditMode ? [Validators.required] : []],
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
      subjectId: [null],
      topicId: [null],
      questions: this.formBuilder.array([]),
    });

    this.testForm?.get('testType')?.valueChanges.subscribe((value) => {
      this.setTestFormValidation(value);
    });

    this.testForm?.get('subjectId')?.valueChanges.subscribe((value) => {
      if (
        this.testForm?.get('testType')?.value === 'topic' &&
        this.testForm?.get('topicId')?.value
      ) {
        const topic = this.topics?.find(
          (topic: any) => topic?.id === this.testForm?.get('topicId')?.value,
        );
        if (topic?.subjectId !== value) {
          this.testForm?.get('topicId')?.patchValue(null);
        }
      }
    });

    this.setTestFormValidation('live');
  }

  ngOnInit() {
    this.getBatchList();
    this.getSubjectList();
    this.getTopicList();
    this.testId = +this.route.snapshot.params['testId'];
    if (this.testId) {
      this.isEditMode = true;
      const url = this.router?.url?.split('/');
      this.testType = url[url.length - 2]?.split('-')[1];
      this.viewQuestions = false;

      if (
        isNaN(this.testId) ||
        !['live', 'mock', 'topic'].includes(this.testType)
      ) {
        this.message.error('Error! Invalid test!');
      } else {
        this.getTestDetails();
        this.getTestQuestions();
      }
    } else {
      this.onAddQuestion();
    }
  }

  get questions() {
    return this.testForm?.get('questions') as FormArray;
  }

  private patchValue() {
    if (this.testType === 'live') {
      this.testForm.get('testType')?.patchValue('live');
      this.testForm.get('testName')?.patchValue(this.testDetails?.name);
      this.testForm.get('subjectName')?.patchValue(this.testDetails?.subject);
      this.testForm.get('topics')?.patchValue(this.testDetails?.topic);
      const duration = this.testDetails?.duration;
      this.testForm.get('durationHour')?.patchValue(Math.floor(duration / 60));
      this.testForm.get('durationMinutes')?.patchValue(duration % 60);
      this.testForm
        .get('startDate')
        ?.patchValue(new Date(this.testDetails?.startTime));
      this.testForm
        .get('startTime')
        ?.patchValue(new Date(this.testDetails?.startTime).getTime());
      this.testForm
        .get('endDate')
        ?.patchValue(new Date(this.testDetails?.endTime));
      this.testForm
        .get('endTime')
        ?.patchValue(new Date(this.testDetails?.endTime).getTime());
      this.testForm.get('isFree')?.patchValue(this.testDetails?.isFree);
      this.testForm.get('batchIds')?.patchValue(this.testDetails?.batchId);
    } else if (this.testType === 'mock') {
      this.testForm.get('testType')?.patchValue('mock');
      this.testForm.get('testName')?.patchValue(this.testDetails?.name);
      this.testForm.get('subjectName')?.patchValue(this.testDetails?.subject);
      this.testForm.get('topics')?.patchValue(this.testDetails?.topic);
      const duration = this.testDetails?.duration;
      this.testForm.get('durationHour')?.patchValue(Math.floor(duration / 60));
      this.testForm.get('durationMinutes')?.patchValue(duration % 60);
      this.testForm.get('isFree')?.patchValue(this.testDetails?.isFree);
    } else {
      this.testForm.get('testType')?.patchValue('topic');
      this.testForm.get('testName')?.patchValue(this.testDetails?.name);

      const topic = this.topics?.find(
        (topic: any) => topic?.id === this.testDetails?.topicId,
      );
      const subject = this.subjects?.find(
        (subject: any) => subject.id === topic?.subjectId,
      );

      this.testForm.get('subjectId')?.patchValue(subject?.id);
      this.testForm.get('topicId')?.patchValue(this.testDetails?.topicId);
      const duration = this.testDetails?.duration;
      this.testForm.get('durationHour')?.patchValue(Math.floor(duration / 60));
      this.testForm.get('durationMinutes')?.patchValue(duration % 60);
      this.testForm.get('isFree')?.patchValue(this.testDetails?.isFree);
    }
  }

  onAddQuestion(question?: {
    questionId?: any;
    question: string;
    correct: string;
    incorrect1: string;
    incorrect2: string;
    incorrect3: string;
    incorrect4?: string;
  }): any {
    const previousControl = this.questions.at(this.questions.length - 1);

    if (!question && previousControl?.invalid) {
      return this.message.error(
        'Error! Please enter question details before adding new!',
      );
    }

    const questionControl = this.formBuilder.group({
      questionId: [question?.questionId ?? null],
      question: [question?.question ?? null, [Validators.required]],
      correctOption: [question?.correct ?? null, [Validators.required]],
      incorrectOption1: [question?.incorrect1 ?? null, [Validators.required]],
      incorrectOption2: [question?.incorrect2 ?? null, [Validators.required]],
      incorrectOption3: [question?.incorrect3 ?? null, [Validators.required]],
      incorrectOption4: [question?.incorrect4 ?? null],
    });

    this.questions.push(questionControl);
  }

  addQuestion(index: number) {
    if (!this.isEditMode) {
      this.message.error("Error! Can't add question on unsaved tests!");
      return;
    }

    const control = this.questions.at(index) as FormGroup;
    if (!control.valid) {
      this.message.error('Marked fields are mandatory!');
      Object.keys(control?.controls)?.forEach((controlName) => {
        control.get(controlName)?.markAsTouched({ onlySelf: true });
        control.get(controlName)?.markAsDirty({ onlySelf: true });
        control.get(controlName)?.updateValueAndValidity({ onlySelf: true });
      });
      return;
    }

    const data: any = {
      testId: this.testId,
      testType: this.testType,
      question: control?.get('question')?.value,
      correctOption: control?.get('correctOption')?.value,
      option2: control?.get('incorrectOption1')?.value,
      option3: control?.get('incorrectOption2')?.value,
      option4: control?.get('incorrectOption3')?.value,
    };

    control?.get('incorrectOption4')?.value
      ? (data.option5 = control?.get('incorrectOption4')?.value)
      : null;

    this.http.createQuestion(data).subscribe({
      next: (res: any) => {
        control?.get('questionId')?.patchValue(res?.data?.questionId);
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  saveQuestion(index: number) {
    const data: any = {};
    const control = this.questions?.at(index);

    data.questionId = control?.get('questionId')?.value;
    data.question = control?.get('question')?.value;
    data.correctOption = control?.get('correctOption')?.value;
    data.option2 = control?.get('incorrectOption1')?.value;
    data.option3 = control?.get('incorrectOption2')?.value;
    data.option4 = control?.get('incorrectOption3')?.value;
    data.option5 = control?.get('incorrectOption4')?.value;

    this.http.saveQuestion(data).subscribe({
      next: (res: any) => {
        this.questions.clear();
        this.getTestQuestions();
        // this.topics = res?.data;
        this.editQuestionId = undefined;
        this.message.success('Successful! Question saved!');
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  deleteQuestion() {
    this.http.deleteQuestion({ questionId: this.deleteQuestionId }).subscribe({
      next: (res: any) => {
        this.getTestQuestions();
        // this.topics = res?.data;
        this.deleteQuestionId = undefined;
        this.isDeleteQuestionModal = false;
        this.message.success('Successful! Question deleted!');
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
    console.log(this.deleteQuestionId);
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  saveTest() {
    if (this.isEditMode) {
      console.log(this.testType);
      if (this.testType === 'live') {
        this.saveLiveTest();
      } else if (this.testType === 'mock') {
        this.saveMockTest();
      } else if (this.testType === 'topic') {
        this.saveTopicTest();
      } else {
        this.router.navigate(['/', 'admin', 'tests']);
        this.message.error('Error! Invalid test!');
      }
    } else {
      this.message.error('Error! Invalid request!');
    }
  }

  saveLiveTest() {
    if (this.testForm.invalid) {
      this.isSaveTestModal = false;
      this.message.error('Marked fields are mandatory!');
      this.markFormGroupTouchedDirty(this.testForm);
      return;
    }

    const data: any = {};
    data.testId = this.testId;
    data.name = this.testForm?.get('testName')?.value;
    data.subject = this.testForm?.get('subjectName')?.value;
    data.topics = this.testForm?.get('topics')?.value;
    data.duration =
      this.testForm?.get('durationHour')?.value * 60 +
      this.testForm?.get('durationMinutes')?.value;

    const startDate = new Date(this.testForm?.get('startDate')?.value);
    const startTime = new Date(this.testForm?.get('startTime')?.value);
    const endDate = new Date(this.testForm?.get('endDate')?.value);
    const endTime = new Date(this.testForm?.get('endTime')?.value);

    let year = startDate?.getFullYear();
    let month = startDate?.getMonth();
    let day = startDate?.getDate();

    // Extract the hours, minutes, and seconds from the time object
    let hours = startTime?.getHours();
    let minutes = startTime?.getMinutes();
    data.startTime = new Date(
      year,
      month,
      day,
      hours,
      minutes,
      0,
    ).toISOString();

    year = endDate?.getFullYear();
    month = endDate?.getMonth();
    day = endDate?.getDate();

    // Extract the hours, minutes, and seconds from the time object
    hours = endTime?.getHours();
    minutes = endTime?.getMinutes();
    data.endTime = new Date(year, month, day, hours, minutes, 0).toISOString();

    data.isFree = this.testForm?.get('isFree')?.value;
    data.batchIds = this.testForm?.get('batchIds')?.value;

    this.http.saveLiveTest(data).subscribe({
      next: (res: any) => {
        console.log(res);
        this.saveTestAndNavigate();
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  saveMockTest() {
    if (this.testForm.invalid) {
      this.isSaveTestModal = false;
      this.message.error('Marked fields are mandatory!');
      this.markFormGroupTouchedDirty(this.testForm);
      return;
    }

    const data: any = {};
    data.testId = this.testId;
    data.name = this.testForm?.get('testName')?.value;
    data.subject = this.testForm?.get('subjectName')?.value;
    data.topics = this.testForm?.get('topics')?.value;
    data.duration =
      this.testForm?.get('durationHour')?.value * 60 +
      this.testForm?.get('durationMinutes')?.value;

    data.isFree = this.testForm?.get('isFree')?.value;

    this.http.saveMockTest(data).subscribe({
      next: (res: any) => {
        console.log(res);
        this.saveTestAndNavigate();
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  saveTopicTest() {
    if (this.testForm.invalid) {
      this.isSaveTestModal = false;
      this.message.error('Marked fields are mandatory!');
      this.markFormGroupTouchedDirty(this.testForm);
      return;
    }

    const data: any = {};
    data.testId = this.testId;
    data.name = this.testForm?.get('testName')?.value;
    data.topicId = this.testForm?.get('topicId')?.value;
    data.duration =
      this.testForm?.get('durationHour')?.value * 60 +
      this.testForm?.get('durationMinutes')?.value;

    data.isFree = this.testForm?.get('isFree')?.value;

    this.http.saveTopicTest(data).subscribe({
      next: (res: any) => {
        console.log(res);
        this.saveTestAndNavigate();
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  markFormGroupTouchedDirty(formGroup: FormGroup | FormArray): void {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control?.errors) {
        console.log(field);
      }
      if (control instanceof FormControl) {
        control?.markAsTouched({ onlySelf: true });
        control?.markAsDirty({ onlySelf: true });
        control?.updateValueAndValidity({ onlySelf: true });
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouchedDirty(control); // Recursively handle nested FormGroups and FormArrays
      }
    });
  }

  saveTestAndNavigate() {
    this.message.success('Successful! Test saved!');
    this.router.navigate(['/', 'admin', 'tests']);
  }

  createTest() {
    if (!this.testForm.valid) {
      console.log(this.testForm);
      this.isSaveTestModal = false;
      this.message.error('Marked fields are mandatory!');
      this.markFormGroupTouchedDirty(this.testForm);
      return;
    }

    const formValues = this.testForm.value;

    const formData: any = {
      testType: formValues?.testType,
      testName: formValues?.testName,
      duration: +formValues?.durationHour * 60 + +formValues?.durationMinutes,
      isFree: formValues?.isFree,
    };

    switch (formValues?.testType) {
      case 'live':
        formData.batchIds = formValues?.batchIds ?? [];

        if (!formValues?.batchIds || formValues?.batchIds?.length === 0) {
          formData.isFree = true;
        }

        formData.subject = formValues?.subjectName;
        formData.topics = formValues?.topics;

        const startTime = new Date(formValues?.startDate);
        startTime.setTime(new Date(formValues?.startTime).getTime());

        const endTime = new Date(formValues?.endDate);
        startTime.setTime(new Date(formValues?.endTime).getTime());

        formData.startTime = startTime.toISOString();
        formData.endTime = endTime.toISOString();
        break;

      case 'mock':
        formData.subject = formValues?.subjectName;
        formData.topics = formValues?.topics;
        break;

      case 'topic':
        formData.topicId = formValues?.topicId;
        break;

      default:
        this.message.error('Invalid Operation');
        return;
    }

    formData.questions = formValues.questions?.map((question: any) => {
      return {
        question: question.question,
        correctOption: question.correctOption,
        option2: question.incorrectOption1,
        option3: question.incorrectOption2,
        option4: question.incorrectOption3,
        option5: question.incorrectOption4,
      };
    });

    // console.log(formData);

    this.http.createTest(formData).subscribe({
      next: (res: any) => {
        this.message.success('Test created successfully');
        this.router.navigate(['/', 'admin', 'tests']);
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(
          error?.error?.message ?? 'Oops! Something went wrong',
        );
      },
    });
  }

  beforeUpload = (file: NzUploadFile): boolean => {
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
    if (!this.isEditMode) {
      this.questions.clear();
    }
    questions?.forEach((question: any) => {
      this.onAddQuestion({
        questionId: question?.id,
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
      batchIdControl?.clearValidators();
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

  getTestDetails() {
    this.isLoading = true;
    const data: any = {
      testId: this.testId,
      testType: this.testType,
    };

    this.http.getTestDetails(data).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.testDetails = res?.data?.testDetails;
        this.patchValue();
      },
      error: (error: any) => {
        this.isLoading = false;
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  getTestQuestions() {
    this.isQuestionLoading = true;
    const data: any = {
      testId: this.testId,
      testType: this.testType,
    };

    this.http.getTestQuestions(data).subscribe({
      next: (res: any) => {
        this.isQuestionLoading = false;
        this.testQuestions = res?.data?.questions;
        this.questions.clear();
        this.addCSVQuestions(this.testQuestions);
      },
      error: (error: any) => {
        this.isQuestionLoading = false;
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  getSubjectList() {
    this.http.getSubjectList().subscribe({
      next: (res: any) => {
        this.subjects = res?.data;
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  getTopicList() {
    this.http.getTopicList().subscribe({
      next: (res: any) => {
        this.topics = res?.data;
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  getBatchList() {
    this.http.getBatchList().subscribe({
      next: (res: any) => {
        this.batches = res?.data;
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  protected readonly console = console;
}
