import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminHttpService } from '../../shared/services/admin-http.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalService } from '../../shared/services/global.service';

@Component({
  standalone: false,
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.css',
})
export class ResourcesComponent implements OnInit {
  coreSubjects: any;
  domainSubjects: any;
  subjects: any;
  searchSubject: string = '';
  addEditSubjectForm: FormGroup;
  isAddEditSubjectModal = false;
  isEditSubjectMode = false;

  videoLinks: any;
  searchVideo: string = '';
  videoPageIndex: any = 1;
  videoPageSize: any = 30;
  videoTotalCount: any;
  addEditVideoForm: FormGroup;
  isAddEditVideoModal = false;
  isEditVideoMode = false;

  newspapers: any;
  searchNewspaper: string = '';
  searchNewspaperDate: Date | undefined;
  newspaperPageIndex: any = 1;
  newspaperPageSize: any = 30;
  newspaperTotalCount: any;
  addEditNewspaperForm: FormGroup;
  isAddEditNewspaperModal = false;
  isEditNewspaperMode = false;

  isDeleteModal = false;
  deleteMode = '';
  deleteId: any;

  pyqs: any;
  searchPYQ: string = '';
  addEditPyqForm: FormGroup;
  isAddEditPyqModal = false;
  isEditPyqMode = false;

  hoursList: number[] = Array.from({ length: 24 }, (_, i) => i);
  minutesList: number[] = Array.from({ length: 60 }, (_, i) => i);

  selectedTabIndex: number = 0;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly http: AdminHttpService,
    private readonly message: NzMessageService,
    private readonly formBuilder: FormBuilder,
    protected readonly globalService: GlobalService,
  ) {
    this.addEditSubjectForm = this.formBuilder.group({
      subjectId: [{ value: null, disabled: true }],
      name: ['', [Validators.required]],
      isDomain: [false, [Validators.required]],
      isHomescreen: [false, [Validators.required]],
      iconUrl: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/,
          ),
        ],
      ],
    });
    this.addEditVideoForm = this.formBuilder.group({
      videoId: [{ value: null, disabled: true }],
      name: ['', [Validators.required]],
      subject: [false, [Validators.required]],
      isFree: [false, [Validators.required]],
      lengthHr: [null, [Validators.required]],
      lengthMin: [null, [Validators.required]],
      url: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/,
          ),
        ],
      ],
    });
    this.addEditNewspaperForm = this.formBuilder.group({
      newspaperId: [{ value: null, disabled: true }],
      name: ['', [Validators.required]],
      date: [false, [Validators.required]],
      isFree: [false, [Validators.required]],
      url: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/,
          ),
        ],
      ],
    });
    this.addEditPyqForm = this.formBuilder.group({
      pyqId: [{ value: null, disabled: true }],
      name: ['', [Validators.required]],
      url: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/,
          ),
        ],
      ],
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const tabIndex = params['tabIndex'];
      if (tabIndex) {
        this.selectedTabIndex = +tabIndex;
      }
    });

    this.getSubjects();
    this.getVideoLinks();
    this.getNewspapers();
    this.getPYQs();
  }

  getSubjects() {
    const data: any = {};
    if (this.searchSubject) data.search = this.searchSubject;

    this.http.getSubjects(data).subscribe({
      next: (res: any) => {
        this.coreSubjects = res?.data?.core;
        this.domainSubjects = res?.data?.domain;
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  onOpenSubjectModal(subject?: any) {
    this.addEditSubjectForm.reset();
    if (subject) {
      this.isEditSubjectMode = true;
      this.addEditSubjectForm
        ?.get('subjectId')
        ?.setValidators([Validators.required]);
      this.addEditSubjectForm?.updateValueAndValidity();
      this.addEditSubjectForm?.get('subjectId')?.patchValue(subject?.id);
      this.addEditSubjectForm?.get('name')?.patchValue(subject?.name);
      this.addEditSubjectForm?.get('isDomain')?.patchValue(subject?.isDomain);
      this.addEditSubjectForm
        ?.get('isHomescreen')
        ?.patchValue(subject?.isHomescreen);
      this.addEditSubjectForm?.get('iconUrl')?.patchValue(subject?.iconUrl);
    } else {
      this.isEditSubjectMode = false;
      this.addEditSubjectForm?.get('subjectId')?.clearValidators();
      this.addEditSubjectForm?.updateValueAndValidity();
      this.addEditSubjectForm?.get('isDomain')?.patchValue(false);
      this.addEditSubjectForm?.get('isHomescreen')?.patchValue(false);
    }
    this.isAddEditSubjectModal = true;
  }

  onAddEditSubject() {
    if (this.addEditSubjectForm.invalid) {
      this.message.error('Marked fields are mandatory!');
      Object.keys(this.addEditSubjectForm?.controls)?.forEach((field) => {
        const control = this.addEditSubjectForm?.get(field);
        control?.markAsDirty({ onlySelf: true });
        control?.markAsTouched({ onlySelf: true });
        control?.updateValueAndValidity({ onlySelf: true });
      });
      return;
    }

    const payload: any = {};
    this.isEditSubjectMode
      ? (payload.subjectId = this.addEditSubjectForm?.get('subjectId')?.value)
      : null;
    payload.subjectName = this.addEditSubjectForm?.get('name')?.value;
    payload.iconUrl = this.addEditSubjectForm?.get('iconUrl')?.value;
    payload.isDomain = this.addEditSubjectForm?.get('isDomain')?.value;
    payload.isHomescreen = this.addEditSubjectForm?.get('isHomescreen')?.value;

    if (this.isEditSubjectMode) {
      this.http.putEditSubject(payload).subscribe({
        next: (res: any) => {
          this.message.success('Successful! Subject updated!');
          this.getSubjects();
          this.onModalClose();
        },
        error: (error: any) => {
          console.log(error);
          this.message.error(error?.error?.message);
        },
      });
    } else {
      this.http.postCreateSubject(payload).subscribe({
        next: (res: any) => {
          this.message.success('Successful! Subject created!');
          this.getSubjects();
          this.onModalClose();
        },
        error: (error: any) => {
          console.log(error);
          this.message.error(error?.error?.message);
        },
      });
    }
  }

  getVideoLinks(event?: any) {
    const data: any = {
      page: this.videoPageIndex,
      limit: this.videoPageSize,
    };

    if (event) {
      data.page = event?.pageIndex;
      data.limit = event?.pageSize;
      this.videoPageIndex = event?.pageIndex;
      this.videoPageSize = event?.pageSize;
    }

    if (this.searchVideo) data.search = this.searchVideo;

    this.http.getVideoLinks(data).subscribe({
      next: (res: any) => {
        this.videoLinks = res?.data?.videos;
        this.videoTotalCount = res?.data?.total;
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  onOpenVideoModal(video?: any) {
    this.addEditVideoForm.reset();
    if (video) {
      this.isEditVideoMode = true;
      this.addEditVideoForm
        ?.get('videoId')
        ?.setValidators([Validators.required]);
      this.addEditVideoForm?.updateValueAndValidity();
      this.addEditVideoForm?.get('videoId')?.patchValue(video?.id);
      this.addEditVideoForm?.get('name')?.patchValue(video?.name);
      this.addEditVideoForm?.get('subject')?.patchValue(video?.subject);
      this.addEditVideoForm?.get('isFree')?.patchValue(video?.isFree);
      this.addEditVideoForm
        ?.get('lengthHr')
        ?.patchValue(Math.floor(video?.length / 60));
      this.addEditVideoForm?.get('lengthMin')?.patchValue(video?.length % 60);
      this.addEditVideoForm?.get('url')?.patchValue(video?.url);
    } else {
      this.isEditVideoMode = false;
      this.addEditVideoForm?.get('videoId')?.clearValidators();
      this.addEditVideoForm?.updateValueAndValidity();
      this.addEditVideoForm?.get('isFree')?.patchValue(false);
    }
    this.isAddEditVideoModal = true;
  }

  onAddEditVideo() {
    if (this.addEditVideoForm.invalid) {
      console.log(this.addEditVideoForm);
      this.message.error('Marked fields are mandatory!');
      Object.keys(this.addEditVideoForm?.controls)?.forEach((field) => {
        const control = this.addEditVideoForm?.get(field);
        control?.markAsDirty({ onlySelf: true });
        control?.markAsTouched({ onlySelf: true });
        control?.updateValueAndValidity({ onlySelf: true });
      });
      return;
    }

    const payload: any = {};
    this.isEditVideoMode
      ? (payload.videoId = this.addEditVideoForm?.get('videoId')?.value)
      : null;
    payload.name = this.addEditVideoForm?.get('name')?.value;
    payload.subject = this.addEditVideoForm?.get('subject')?.value;
    payload.url = this.addEditVideoForm?.get('url')?.value;
    payload.length =
      this.addEditVideoForm?.get('lengthHr')?.value * 60 +
      this.addEditVideoForm?.get('lengthMin')?.value;
    payload.isFree = this.addEditVideoForm?.get('isFree')?.value;

    if (this.isEditVideoMode) {
      this.http.putEditVideoLink(payload).subscribe({
        next: (res: any) => {
          this.message.success('Successful! Video updated!');
          this.getVideoLinks();
          this.onModalClose();
        },
        error: (error: any) => {
          console.log(error);
          this.message.error(error?.error?.message);
        },
      });
    } else {
      this.http.postCreateVideoLink(payload).subscribe({
        next: (res: any) => {
          this.message.success('Successful! Video created!');
          this.getVideoLinks();
          this.onModalClose();
        },
        error: (error: any) => {
          console.log(error);
          this.message.error(error?.error?.message);
        },
      });
    }
  }

  onOpenDeleteModal(deleteId: any, deleteMode: string) {
    if (deleteId === undefined || deleteId === null) {
      this.message.error('Error! Selection Invalid!');
      return;
    }
    this.deleteId = deleteId;
    this.deleteMode = deleteMode;
    this.isDeleteModal = true;
  }

  onDelete() {
    if (this.deleteMode === 'pyq') {
      this.http.deletePYQ({ pyqId: this.deleteId }).subscribe({
        next: (res: any) => {
          this.getPYQs();
          this.message.success('Successful! PYQ deleted!');
          this.onModalClose();
        },
        error: (error: any) => {
          console.log(error);
          this.message.error(error?.error?.message);
        },
      });
    } else if (this.deleteMode === 'video link') {
      this.http.deleteVideoLink({ videoId: this.deleteId }).subscribe({
        next: (res: any) => {
          this.getVideoLinks();
          this.message.success('Successful! Video Link deleted!');
          this.onModalClose();
        },
        error: (error: any) => {
          console.log(error);
          this.message.error(error?.error?.message);
        },
      });
    } else if (this.deleteMode === 'newspaper') {
      this.http.deleteNewspaper({ newspaperId: this.deleteId }).subscribe({
        next: (res: any) => {
          this.getNewspapers();
          this.message.success('Successful! Newspaper deleted!');
          this.onModalClose();
        },
        error: (error: any) => {
          console.log(error);
          this.message.error(error?.error?.message);
        },
      });
    } else if (this.deleteMode === 'subject') {
      this.http.deleteSubject({ subjectId: this.deleteId }).subscribe({
        next: (res: any) => {
          this.getSubjects();
          this.message.success('Successful! Subject deleted!');
          this.onModalClose();
        },
        error: (error: any) => {
          console.log(error);
          this.message.error(error?.error?.message);
        },
      });
    } else {
      this.message.error('Error! Selection Invalid!');
      return;
    }
  }

  getNewspapers(event?: any) {
    const data: any = {
      page: this.newspaperPageIndex,
      limit: this.newspaperPageSize,
    };

    if (event) {
      data.page = event?.pageIndex;
      data.limit = event?.pageSize;
      this.newspaperPageIndex = event?.pageIndex;
      this.newspaperPageSize = event?.pageSize;
    }

    if (this.searchNewspaper) data.search = this.searchNewspaper;

    if (this.searchNewspaperDate)
      data.date = this.searchNewspaperDate?.toISOString();

    this.http.getNewspapers(data).subscribe({
      next: (res: any) => {
        this.newspapers = res?.data?.newspapers;
        this.newspaperTotalCount = res?.data?.total;
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  onOpenNewspaperModal(newspaper?: any) {
    this.addEditNewspaperForm.reset();
    if (newspaper) {
      this.isEditNewspaperMode = true;
      this.addEditNewspaperForm
        ?.get('newspaperId')
        ?.setValidators([Validators.required]);
      this.addEditNewspaperForm?.updateValueAndValidity();
      this.addEditNewspaperForm?.get('newspaperId')?.patchValue(newspaper?.id);
      this.addEditNewspaperForm?.get('name')?.patchValue(newspaper?.name);
      this.addEditNewspaperForm
        ?.get('date')
        ?.patchValue(new Date(newspaper?.date));
      this.addEditNewspaperForm?.get('isFree')?.patchValue(newspaper?.isFree);
      this.addEditNewspaperForm?.get('url')?.patchValue(newspaper?.url);
    } else {
      this.isEditNewspaperMode = false;
      this.addEditNewspaperForm?.get('newspaperId')?.clearValidators();
      this.addEditNewspaperForm?.updateValueAndValidity();
      this.addEditNewspaperForm?.get('isFree')?.patchValue(false);
    }
    this.isAddEditNewspaperModal = true;
  }

  onAddEditNewspaper() {
    if (this.addEditNewspaperForm.invalid) {
      this.message.error('Marked fields are mandatory!');
      Object.keys(this.addEditNewspaperForm?.controls)?.forEach((field) => {
        const control = this.addEditNewspaperForm?.get(field);
        control?.markAsDirty({ onlySelf: true });
        control?.markAsTouched({ onlySelf: true });
        control?.updateValueAndValidity({ onlySelf: true });
      });
      return;
    }

    const payload: any = {};
    this.isEditNewspaperMode
      ? (payload.newspaperId =
          this.addEditNewspaperForm?.get('newspaperId')?.value)
      : null;
    payload.name = this.addEditNewspaperForm?.get('name')?.value;
    payload.url = this.addEditNewspaperForm?.get('url')?.value;
    payload.date = new Date(
      this.addEditNewspaperForm?.get('date')?.value,
    )?.toISOString();
    payload.isFree = this.addEditNewspaperForm?.get('isFree')?.value;

    if (this.isEditNewspaperMode) {
      this.http.putEditNewspaper(payload).subscribe({
        next: (res: any) => {
          this.message.success('Successful! Newspaper updated!');
          this.getNewspapers();
          this.onModalClose();
        },
        error: (error: any) => {
          console.log(error);
          this.message.error(error?.error?.message);
        },
      });
    } else {
      this.http.postCreateNewspaper(payload).subscribe({
        next: (res: any) => {
          this.message.success('Successful! Newspaper created!');
          this.getNewspapers();
          this.onModalClose();
        },
        error: (error: any) => {
          console.log(error);
          this.message.error(error?.error?.message);
        },
      });
    }
  }

  getPYQs() {
    const data: any = {};
    if (this.searchPYQ) data.search = this.searchPYQ;

    this.http.getPYQs(data).subscribe({
      next: (res: any) => {
        this.pyqs = res?.data;
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  onOpenPyqModal(pyq?: any) {
    this.addEditPyqForm.reset();
    if (pyq) {
      this.isEditPyqMode = true;
      this.addEditPyqForm?.get('pyqId')?.setValidators([Validators.required]);
      this.addEditPyqForm?.updateValueAndValidity();
      this.addEditPyqForm?.get('pyqId')?.patchValue(pyq?.id);
      this.addEditPyqForm?.get('name')?.patchValue(pyq?.name);
      this.addEditPyqForm?.get('url')?.patchValue(pyq?.url);
    } else {
      this.isEditPyqMode = false;
      this.addEditPyqForm?.get('pyqId')?.clearValidators();
      this.addEditPyqForm?.updateValueAndValidity();
    }
    this.isAddEditPyqModal = true;
  }

  onAddEditPyq() {
    if (this.addEditPyqForm.invalid) {
      this.message.error('Marked fields are mandatory!');
      Object.keys(this.addEditPyqForm?.controls)?.forEach((field) => {
        const control = this.addEditPyqForm?.get(field);
        control?.markAsDirty({ onlySelf: true });
        control?.markAsTouched({ onlySelf: true });
        control?.updateValueAndValidity({ onlySelf: true });
      });
      return;
    }

    const payload: any = {};
    payload.name = this.addEditPyqForm?.get('name')?.value;
    payload.url = this.addEditPyqForm?.get('url')?.value;

    if (this.isEditPyqMode) {
      payload.pyqId = this.addEditPyqForm?.get('pyqId')?.value;
      this.http.putEditPYQ(payload).subscribe({
        next: (res: any) => {
          this.message.success('Successful! PYQ updated!');
          this.getPYQs();
          this.onModalClose();
        },
        error: (error: any) => {
          console.log(error);
          this.message.error(error?.error?.message);
        },
      });
    } else {
      this.http.postCreatePYQ(payload).subscribe({
        next: (res: any) => {
          this.message.success('Successful! PYQ created!');
          this.getPYQs();
          this.onModalClose();
        },
        error: (error: any) => {
          console.log(error);
          this.message.error(error?.error?.message);
        },
      });
    }
  }

  onModalClose() {
    this.isAddEditSubjectModal = false;
    this.isEditSubjectMode = false;
    this.isAddEditNewspaperModal = false;
    this.isEditNewspaperMode = false;
    this.isAddEditVideoModal = false;
    this.isEditVideoMode = false;
    this.isAddEditPyqModal = false;
    this.isEditPyqMode = false;
    this.isDeleteModal = false;
    this.deleteId = undefined;
    this.deleteMode = '';
    this.addEditSubjectForm?.reset();
    this.addEditNewspaperForm?.reset();
    this.addEditVideoForm?.reset();
    this.addEditPyqForm?.reset();
  }

  onClickSubject(event: any, subjectId: number) {
    const excludedSection = (event.target as HTMLElement).closest(
      '.dropdown-div',
    );

    if (excludedSection) {
      // Do nothing if the click was on the excluded section
      return;
    }

    this.router.navigate([this.router.url, subjectId]);
  }

  protected readonly Math = Math;
}
