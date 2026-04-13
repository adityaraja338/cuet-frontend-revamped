import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../../shared/services/http.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  standalone: false,
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrl: './topics.component.scss',
})
export class TopicsComponent implements OnInit {
  subjectName: string | undefined = 'Topic';

  topics: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpService,
    private message: NzMessageService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('subjectId');
    this.getTopics(id);
  }

  getTopics(id: any) {
    const data: any = {
      subjectId: +id,
    };

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

  onClickTopic(topicId: number) {
    this.router.navigate([this.router.url, topicId]);
  }

  protected readonly length = length;
}
