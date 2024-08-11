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
    { name: 'Reasoning', id: 0 },
    { name: 'G.K. & G.S.', id: 1 },
    { name: 'Mathematics', id: 2 },
    { name: 'Current Affairs', id: 3 },
    { name: 'English', id: 4 },
    { name: 'Physics', id: 5 },
    { name: 'Chemistry', id: 6 },
    { name: 'Biology', id: 7 },
  ];

  topicTests: any = [
    {
      id: 0,
      name: 'Test 1',
      questions: 120,
      type: 'free',
      duration: 50,
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

  protected readonly Math = Math;
}
