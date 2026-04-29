import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { SimplebarAngularModule } from 'simplebar-angular';

@Component({
  standalone: true,
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css'],
  imports: [CommonModule, SimplebarAngularModule]
})
export class LeaderboardComponent implements OnInit {
  @Input() leaderboardData: any[] = [];
  @Input() hasPadding = false;

  constructor() {}

  ngOnInit(): void {}
}
