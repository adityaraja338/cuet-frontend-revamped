import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-exam-topbar',
  templateUrl: './exam-topbar.component.html',
  styleUrl: './exam-topbar.component.css',
})
export class ExamTopbarComponent {
  @Input() title: string = 'Test';
  @Input() testType: string | null = null;
  @Input() currentIndex: number = 0;
  @Input() total: number = 0;
  @Input() answered: number = 0;
  @Input() countdownTime: number | null = null;
  @Input() totalDurationSeconds: number | null = null;

  @Output() timeUp = new EventEmitter<void>();
  @Output() openPalette = new EventEmitter<void>();

  get progressPercent(): number {
    if (!this.total) return 0;
    return Math.round((this.answered / this.total) * 100);
  }

  get timerUrgency(): 'normal' | 'warn' | 'danger' {
    if (!this.countdownTime) return 'normal';
    const now = Date.now();
    const remainingMs = this.countdownTime - now;
    if (remainingMs <= 0) return 'danger';

    const totalMs =
      this.totalDurationSeconds && this.totalDurationSeconds > 0
        ? this.totalDurationSeconds * 1000
        : null;

    if (totalMs) {
      const ratio = remainingMs / totalMs;
      if (ratio <= 0.1) return 'danger';
      if (ratio <= 0.25) return 'warn';
      return 'normal';
    }

    // Fallback to absolute thresholds when total duration is unknown.
    const remainingMinutes = remainingMs / 60000;
    if (remainingMinutes <= 2) return 'danger';
    if (remainingMinutes <= 5) return 'warn';
    return 'normal';
  }
}
