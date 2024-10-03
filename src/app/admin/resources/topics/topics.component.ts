import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminHttpService } from '../../../shared/services/admin-http.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { GlobalService } from '../../../shared/services/global.service';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrl: './topics.component.scss',
})
export class TopicsComponent implements OnInit {
  subjectName: string | undefined = 'Topic';

  topics: any;
  subjectId: any;
  searchTopic: string = '';

  topicAddEditName: string = '';
  currentTopic: any;
  isAddEditModal = false;
  isDeleteModal = false;
  isEditMode = false;

  collapseFilter: boolean = false;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly http: AdminHttpService,
    private readonly message: NzMessageService,
    protected readonly globalService: GlobalService,
  ) {}

  ngOnInit() {
    // console.log(this.router.url);
    this.subjectId = +this.route.snapshot.params['subjectId'];

    if (isNaN(this.subjectId)) {
      this.message.error('Error! Invalid subject selected!');
      this.router.navigate(['/', 'admin', 'resources']);
      return;
    }

    this.getTopics();
  }

  getTopics() {
    const data: any = {};

    data.subjectId = this.subjectId;
    if (this.searchTopic) data.search = this.searchTopic;

    this.http.getTopics(data).subscribe({
      next: (res: any) => {
        this.topics = res?.data?.topics;
        this.subjectName = res?.data?.subjectName;
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  onAddEditTopic() {
    const payload: any = {};
    payload.name = this.topicAddEditName;
    payload.subjectId = this.subjectId;

    if (this.currentTopic) {
      payload.topicId = this.currentTopic?.id;

      this.http.putEditTopic(payload).subscribe({
        next: (res: any) => {
          this.message.success('Successful! Topic updated!');
          this.getTopics();
          this.onModalClose();
        },
        error: (error: any) => {
          console.log(error);
          this.message.error(error?.error?.message);
        },
      });
    } else {
      this.http.postCreateTopic(payload).subscribe({
        next: (res: any) => {
          this.message.success('Successful! Topic created!');
          this.getTopics();
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
    this.currentTopic = undefined;
    this.isAddEditModal = false;
    this.isDeleteModal = false;
    this.isEditMode = false;
    this.topicAddEditName = '';
  }

  onOpenEditModal(topic: any) {
    this.currentTopic = topic;
    this.topicAddEditName = topic?.name;
    this.isEditMode = true;
    this.isAddEditModal = true;
  }

  onOpenDeleteModal(topic: any) {
    this.currentTopic = topic;
    this.isDeleteModal = true;
  }

  onDeleteTopic() {
    const data: any = {
      topicId: this.currentTopic?.id,
    };

    this.http.deleteTopic(data).subscribe({
      next: (res: any) => {
        this.message.success('Successful! Topic deleted!');
        this.getTopics();
        this.onModalClose();
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  onClickTopic(event: any, topicId: number) {
    const excludedSection = (event.target as HTMLElement).closest(
      '.dropdown-div',
    );

    if (excludedSection) {
      // Do nothing if the click was on the excluded section
      return;
    }

    this.router.navigate([this.router.url, topicId]);
  }
}
