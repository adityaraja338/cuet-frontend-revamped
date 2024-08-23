import { Component } from '@angular/core';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrl: './materials.component.scss',
})
export class MaterialsComponent {
  subjectName: string = 'Subject';
  topicName: string = 'Topic';

  materials: any[] = [
    { name: 'Reasoning', id: 0, isFree: true },
    { name: 'G.K. & G.S.', id: 1, isFree: true },
    { name: 'Mathematics', id: 2, isFree: false },
    { name: 'Current Affairs', id: 3, isFree: false },
    { name: 'English', id: 4, isFree: false },
    { name: 'Physics', id: 5, isFree: true },
    { name: 'Chemistry', id: 6, isFree: false },
    { name: 'Biology', id: 7, isFree: false },
  ];

  topicTests: any = [
    {
      id: 0,
      name: 'Test 1',
      questions: 120,
      type: 'free',
      duration: 120,
    },
    {
      id: 1,
      name: 'Test 2',
      questions: 105,
      type: 'free',
      duration: 50,
    },
    {
      id: 2,
      name: 'Test 3',
      questions: 60,
      type: 'paid',
      duration: 50,
    },
    {
      id: 3,
      name: 'Test 4',
      questions: 96,
      type: 'free',
      duration: 50,
    },
    {
      id: 4,
      name: 'Test 5',
      questions: 55,
      type: 'paid',
      duration: 50,
    },
  ];

  collapseFilter: boolean = false;

  protected readonly Math = Math;
}
