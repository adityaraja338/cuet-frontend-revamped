import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-test-detail',
  templateUrl: './test-detail.component.html',
  styleUrl: './test-detail.component.scss',
})
export class TestDetailComponent implements OnInit {
  isRankList: boolean = false;

  studentData: any = [
    { id: 1, name: 'Aditya', score: '120/240', accuracy: '50%' },
    { id: 2, name: 'Aditya 2', score: '124/240', accuracy: '50%' },
    { id: 3, name: 'Aditya 3', score: '190/240', accuracy: '50%' },
    { id: 4, name: 'Aditya 4', score: '156/240', accuracy: '50%' },
    { id: 5, name: 'Aditya 5', score: '152/240', accuracy: '50%' },
    { id: 6, name: 'Aditya 6', score: '112/240', accuracy: '50%' },
    { id: 7, name: 'Aditya 7', score: '167/240', accuracy: '50%' },
    { id: 8, name: 'Aditya 8', score: '78/240', accuracy: '50%' },
  ];

  constructor(private readonly router: Router) {}

  ngOnInit() {
    const urlFragments = this.router.url
      .split('/')
      .filter((fragment) => fragment);
    // console.log(urlFragments);
    if (!+urlFragments[urlFragments.length - 1]) {
      this.router.navigate(['/', 'admin', 'tests']);
    }
  }
}
