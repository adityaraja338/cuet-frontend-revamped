import { Component, Input } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-resource-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.css',
})
export class ResourceSkeletonComponent {
  @Input() variant: 'subject-row' | 'topic-row' | 'card' | 'list-row' = 'card';
  @Input() count: number = 1;

  get items(): number[] {
    return Array.from({ length: this.count }, (_, i) => i);
  }
}
