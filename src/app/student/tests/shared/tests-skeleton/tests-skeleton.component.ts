import { Component, Input } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-tests-skeleton',
  templateUrl: './tests-skeleton.component.html',
  styleUrl: './tests-skeleton.component.css',
})
export class TestsSkeletonComponent {
  @Input() variant: 'table-row' | 'topic-row' | 'question' = 'table-row';
  @Input() count: number = 3;

  get items(): number[] {
    return Array.from({ length: this.count }, (_, i) => i);
  }
}
