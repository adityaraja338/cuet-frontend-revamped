import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.scss',
})
export class ResourcesComponent implements OnInit {
  subjects: any[] = [
    { name: 'Reasoning', id: 0 },
    { name: 'G.K. & G.S.', id: 1 },
    { name: 'Mathematics', id: 2 },
    { name: 'Current Affairs', id: 3 },
    { name: 'English', id: 4 },
    { name: 'Physics', id: 5 },
    { name: 'Chemistry', id: 6 },
    { name: 'Biology', id: 7 },
  ];

  videoLinks: any = [
    {
      name: 'Video 1',
      subject: 'Subject 1',
      length: 120,
      type: 'free',
      link: 'https://www.google.co.in',
    },
    {
      name: 'Video 2',
      subject: 'Subject 2',
      length: 105,
      type: 'free',
      link: 'https://www.google.co.in',
    },
    {
      name: 'Video 3',
      subject: 'Subject 3',
      length: 60,
      type: 'paid',
      link: 'https://www.google.co.in',
    },
    {
      name: 'Video 4',
      subject: 'Subject 4',
      length: 96,
      type: 'free',
      link: 'https://www.google.co.in',
    },
    {
      name: 'Video 5',
      subject: 'Subject 5',
      length: 55,
      type: 'paid',
      link: null,
    },
  ];

  newspapers: any = [
    {
      id: 0,
      name: 'The Hindu',
      date: '12/06/2024',
      isFree: false,
      url: 'https://google.com',
    },
    {
      id: 1,
      name: 'TOI',
      date: '12/06/2024',
      isFree: false,
      url: 'https://google.com',
    },
    {
      id: 2,
      name: 'Times Now',
      date: '12/06/2024',
      isFree: true,
      url: 'https://google.com',
    },
    {
      id: 3,
      name: 'Gazette',
      date: '12/06/2024',
      isFree: false,
      url: 'https://google.com',
    },
    {
      id: 4,
      name: 'The Hindu',
      date: '12/06/2024',
      isFree: true,
      url: 'https://google.com',
    },
    {
      id: 5,
      name: 'The Hindu',
      date: '12/06/2024',
      isFree: false,
      url: 'https://google.com',
    },
  ];

  collapseFilter: boolean = false;

  selectedTabIndex: number = 0;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const tabIndex = params['tabIndex'];
      if (tabIndex) {
        this.selectedTabIndex = +tabIndex;
      }
    });
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
