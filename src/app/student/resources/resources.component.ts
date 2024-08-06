import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.scss',
})
export class ResourcesComponent {
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

  constructor(private readonly router: Router) {}

  onClickSubject(subjectName: string, subjectId: number) {
    // console.log('test');
    let route = subjectName.toLowerCase().replace(/\s+/g, '-');
    route = route.replace(/[^a-zA-Z-]/g, '');

    // Replace multiple consecutive hyphens with a single hyphen
    route = route.replace(/-+/g, '-');

    // Remove leading or trailing hyphens if any
    route = route.replace(/^-|-$/g, '');

    this.router.navigate(['/student/resources', route], {
      state: { subjectId },
    });
  }

  protected readonly Math = Math;
}
