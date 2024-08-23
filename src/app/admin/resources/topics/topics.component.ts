import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrl: './topics.component.scss',
})
export class TopicsComponent {
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

  collapseFilter: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // console.log(this.router.url);
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
