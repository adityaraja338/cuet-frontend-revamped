import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrl: './topics.component.scss',
})
export class TopicsComponent implements OnInit {
  subjectName: string | undefined = 'Topic';

  topics: any[] = [
    { name: 'Reasoning', id: 0 },
    { name: 'G.K. & G.S.', id: 1 },
    { name: 'Mathematics', id: 2 },
    { name: 'Current Affairs', id: 3 },
    { name: 'English', id: 4 },
    { name: 'Physics', id: 5 },
    { name: 'Chemistry', id: 6 },
    { name: 'Biology', id: 7 },
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    // console.log(this.router.url);
  }

  onClickTopic(topicId: number) {
    this.router.navigate([this.router.url, topicId]);
  }
}
