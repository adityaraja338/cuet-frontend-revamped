import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../shared/services/global.service';
import { AdminHttpService } from '../../shared/services/admin-http.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  standalone: false,
  selector: 'app-events-and-notifications',
  templateUrl: './events-and-notifications.component.html',
  styleUrl: './events-and-notifications.component.scss',
})
export class EventsAndNotificationsComponent implements OnInit {
  events: any = [];
  eventPageIndex: number = 1;
  eventPageSize: number = 20;
  eventTotalCount: number = 0;
  eventSearch: string = '';
  isCreateEditEventModal: boolean = false;
  isEditEvent: boolean = false;
  eventForm: FormGroup;

  notifications: any = [];
  notificationPageIndex: number = 1;
  notificationPageSize: number = 20;
  notificationTotalCount: number = 0;
  notificationSearch: string = '';
  isCreateEditNotificationModal: boolean = false;
  isEditNotification: boolean = false;
  notificationForm: FormGroup;

  sentToOptions: any = [
    { value: 'ALL_STUDENTS', label: 'All Students' },
    { value: 'ALL_ADMINS', label: 'All Admins' },
    { value: 'ALL_USERS', label: 'All Users' },
    { value: 'STUDENT', label: 'Students' },
    { value: 'BATCH', label: 'Batches' },
    { value: 'ADMIN', label: 'Admins' },
    { value: 'ROLE', label: 'Roles' },
  ];

  sendNotificationData: any;
  isSendNotificationModal = false;

  isDeleteModal = false;
  deleteMode: string = '';
  deleteId: any;

  admins: any = [];
  students: any = [];
  roles: any = [];
  batches: any = [];

  constructor(
    protected readonly globalService: GlobalService,
    private readonly http: AdminHttpService,
    private readonly message: NzMessageService,
    private readonly fb: FormBuilder,
  ) {
    this.eventForm = this.fb.group({
      id: [{ value: null, disabled: true }, []],
      title: ['', [Validators.required, Validators.maxLength(40)]],
      text: ['', [Validators.required, Validators.maxLength(120)]],
      date: [new Date(), [Validators.required]],
      sentTo: ['STUDENTS', [Validators.required]],
      sentToIds: [[], [Validators.required]],
    });

    this.notificationForm = this.fb.group({
      id: [{ value: null, disabled: true }, []],
      title: ['', [Validators.required, Validators.maxLength(40)]],
      text: ['', [Validators.required, Validators.maxLength(120)]],
      sentTo: ['STUDENTS', [Validators.required]],
      sentToIds: [[], [Validators.required]],
    });

    this.eventForm?.get('sentTo')?.valueChanges.subscribe((e: any) => {
      const value = this.eventForm?.get('sentTo')?.value;

      if (
        value === 'ALL_USERS' ||
        value === 'ALL_STUDENTS' ||
        value === 'ALL_ADMINS'
      ) {
        this.eventForm?.get('sentToIds')?.clearValidators();
      } else if (
        value === 'ADMIN' ||
        value === 'BATCH' ||
        value === 'ROLE' ||
        value === 'STUDENT'
      ) {
        this.eventForm?.get('sentToIds')?.setValidators([Validators.required]);
      } else {
        this.eventForm?.get('sentToIds')?.setValidators([Validators.required]);
      }
      this.eventForm?.get('sentToIds')?.reset();
    });

    this.notificationForm?.get('sentTo')?.valueChanges.subscribe((e: any) => {
      const value = this.notificationForm?.get('sentTo')?.value;

      if (
        value === 'ALL_USERS' ||
        value === 'ALL_STUDENTS' ||
        value === 'ALL_ADMINS'
      ) {
        this.notificationForm?.get('sentToIds')?.clearValidators();
      } else if (
        value === 'ADMIN' ||
        value === 'BATCH' ||
        value === 'ROLE' ||
        value === 'STUDENT'
      ) {
        this.notificationForm
          ?.get('sentToIds')
          ?.setValidators([Validators.required]);
      } else {
        this.notificationForm
          ?.get('sentToIds')
          ?.setValidators([Validators.required]);
      }
      this.notificationForm?.get('sentToIds')?.reset();
    });
  }

  ngOnInit() {
    this.getEvents();
    this.getAdminList();
    this.getStudentList();
    this.getBatchList();
    this.getRoleList();
  }

  getNotifications(event?: any) {
    const data: any = {
      page: this.notificationPageIndex,
      limit: this.notificationPageSize,
    };

    if (event) {
      data['page'] = event.pageIndex;
      data['limit'] = event.pageSize;
      this.notificationPageIndex = event.pageIndex;
      this.notificationPageSize = event.pageSize;
    }

    if (this.notificationSearch) {
      data['search'] = this.notificationSearch;
    }

    this.http.getNotifications(data).subscribe({
      next: (res: any) => {
        this.notifications = res?.data?.notifications;
        this.notificationTotalCount = res?.data?.total;
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  onClickNotification(event: any, notification: any) {
    const excludedSection = (event.target as HTMLElement).closest(
      '.dropdown-container',
    );

    if (excludedSection) {
      // Do nothing if the click was on the excluded section
      return;
    }

    this.onOpenAddEditNotificationModal(notification);
  }

  onOpenAddEditNotificationModal(notification?: any) {
    if (notification) {
      this.notificationForm?.reset();
      this.notificationForm?.get('id')?.setValidators([Validators.required]);
      this.notificationForm?.updateValueAndValidity();

      this.notificationForm?.get('id')?.patchValue(notification?.id);
      this.notificationForm?.get('title')?.patchValue(notification?.title);
      this.notificationForm?.get('text')?.patchValue(notification?.text);
      this.notificationForm?.get('sentTo')?.patchValue(notification?.sentTo);
      if (notification?.sentToIds)
        this.notificationForm
          ?.get('sentToIds')
          ?.patchValue(notification?.sentToIds);

      this.isEditNotification = true;
    } else {
      this.notificationForm?.reset();
      this.notificationForm?.get('id')?.clearValidators();
      this.notificationForm?.updateValueAndValidity();

      this.isEditNotification = false;
    }
    this.isCreateEditNotificationModal = true;
  }

  onCreateEditNotification() {
    if (this.notificationForm.invalid) {
      Object.keys(this.notificationForm.controls).forEach((field: string) => {
        const control = this.notificationForm.get(field);
        control?.markAsDirty({ onlySelf: true });
        control?.markAsTouched({ onlySelf: true });
        control?.updateValueAndValidity({ onlySelf: true });
      });
      return;
    }

    const data: any = {};
    data.title = this.notificationForm?.get('title')?.value;
    data.text = this.notificationForm?.get('text')?.value;
    data.sentTo = this.notificationForm?.get('sentTo')?.value;
    data.sentToIds = this.notificationForm?.get('sentToIds')?.value || [];

    if (this.isEditNotification) {
      data.id = this.notificationForm?.get('id')?.value;
      this.http.putEditNotification(data).subscribe({
        next: (res: any) => {
          this.getNotifications();
          this.message.success('Successful! Notification edited!');
          this.onModalClose();
        },
        error: (error: any) => {
          console.log(error);
          this.message.error(error?.error?.message);
        },
      });
    } else {
      this.http.postCreateNotification(data).subscribe({
        next: (res: any) => {
          this.getNotifications();
          this.message.success('Successful! Notification created!');
          this.onModalClose();
        },
        error: (error: any) => {
          console.log(error);
          this.message.error(error?.error?.message);
        },
      });
    }
  }

  onDeleteNotification(deleteId: any) {
    const data: any = {
      notificationId: deleteId,
    };

    this.http.deleteNotification(data).subscribe({
      next: (res: any) => {
        this.getNotifications();
        this.message.success('Successful! Notification deleted!');
        this.onModalClose();
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  getEvents(event?: any) {
    const data: any = {
      page: this.eventPageIndex,
      limit: this.eventPageSize,
    };

    if (event) {
      data['page'] = event.pageIndex;
      data['limit'] = event.pageSize;
      this.eventPageIndex = event.pageIndex;
      this.eventPageSize = event.pageSize;
    }

    if (this.eventSearch) {
      data['search'] = this.eventSearch;
    }

    this.http.getEvents(data).subscribe({
      next: (res: any) => {
        this.events = res?.data?.events;
        this.eventTotalCount = res?.data?.total;
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  onClickEvent(event: any, e: any) {
    const excludedSection = (event.target as HTMLElement).closest(
      '.dropdown-container',
    );

    if (excludedSection) {
      // Do nothing if the click was on the excluded section
      return;
    }

    this.onOpenAddEditEventModal(e);
  }

  onOpenAddEditEventModal(event?: any) {
    if (event) {
      this.eventForm?.reset();
      this.eventForm?.get('id')?.setValidators([Validators.required]);
      this.eventForm?.updateValueAndValidity();

      this.eventForm?.get('id')?.patchValue(event?.id);
      this.eventForm?.get('title')?.patchValue(event?.title);
      this.eventForm?.get('text')?.patchValue(event?.text);
      this.eventForm?.get('date')?.patchValue(event?.date);
      this.eventForm?.get('sentTo')?.patchValue(event?.sentTo);
      if (event?.sentToId)
        this.eventForm?.get('sentToId')?.patchValue(event?.sentToId);
      if (event?.sentToIds)
        this.eventForm?.get('sentToIds')?.patchValue(event?.sentToIds);

      this.isEditEvent = true;
    } else {
      this.eventForm?.reset();
      this.eventForm?.get('id')?.clearValidators();
      this.eventForm?.updateValueAndValidity();

      this.eventForm?.get('date')?.patchValue(new Date());
      this.isEditEvent = false;
    }
    this.isCreateEditEventModal = true;
  }

  onCreateEditEvent() {
    if (this.eventForm.invalid) {
      Object.keys(this.eventForm.controls).forEach((field: string) => {
        const control = this.eventForm.get(field);
        control?.markAsDirty({ onlySelf: true });
        control?.markAsTouched({ onlySelf: true });
        control?.updateValueAndValidity({ onlySelf: true });
      });
      return;
    }

    const data: any = {};
    data.title = this.eventForm?.get('title')?.value;
    data.text = this.eventForm?.get('text')?.value;
    data.date = new Date(this.eventForm?.get('date')?.value)?.toISOString();
    data.sentTo = this.eventForm?.get('sentTo')?.value;
    data.sentToIds = this.eventForm?.get('sentToIds')?.value || [];

    if (this.isEditEvent) {
      data.id = this.eventForm?.get('id')?.value;
      this.http.putEditEvent(data).subscribe({
        next: (res: any) => {
          this.getEvents();
          this.message.success('Successful! Event edited!');
          this.onModalClose();
        },
        error: (error: any) => {
          console.log(error);
          this.message.error(error?.error?.message);
        },
      });
    } else {
      this.http.postCreateEvent(data).subscribe({
        next: (res: any) => {
          this.getEvents();
          this.message.success('Successful! Event created!');
          this.onModalClose();
          this.onOpenSendNotificationModal(data);
        },
        error: (error: any) => {
          console.log(error);
          this.message.error(error?.error?.message);
        },
      });
    }
  }

  onDeleteEvent(deleteId: any) {
    const data: any = {
      eventId: deleteId,
    };

    this.http.deleteEvent(data).subscribe({
      next: (res: any) => {
        this.getEvents();
        this.message.success('Successful! Event deleted!');
        this.onModalClose();
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  onOpenSendNotificationModal(data: any) {
    this.sendNotificationData = data;
    this.isSendNotificationModal = true;
  }

  onSendNotification() {
    this.http.postCreateNotification(this.sendNotificationData).subscribe({
      next: (res: any) => {
        this.getNotifications();
        this.message.success('Successful! Notification created!');
        this.onModalClose();
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  onOpenDeleteModal(deleteId: any, deleteMode: string) {
    this.deleteId = deleteId;
    this.deleteMode = deleteMode;

    this.isDeleteModal = true;
  }

  onDelete() {
    if (this.deleteMode === 'event') {
      this.onDeleteEvent(this.deleteId);
    }

    if (this.deleteMode === 'notification') {
      this.onDeleteNotification(this.deleteId);
    }
  }

  onModalClose() {
    this.isCreateEditEventModal = false;
    this.isEditEvent = false;
    this.isCreateEditNotificationModal = false;
    this.isEditNotification = false;
    this.isSendNotificationModal = false;
    this.isDeleteModal = false;
    this.deleteId = undefined;
    this.deleteMode = '';
    this.eventForm.reset();
    this.notificationForm.reset();
  }

  getAdminList() {
    this.http.getAdminList().subscribe({
      next: (res: any) => {
        this.admins = res?.data;
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  getStudentList() {
    this.http.getStudentList().subscribe({
      next: (res: any) => {
        this.students = res?.data;
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

  getRoleList() {
    this.http.getRoleList().subscribe({
      next: (res: any) => {
        this.roles = res?.data;
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }
}
