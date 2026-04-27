import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface Question {
  id: number;
  question: string;
  correctOption: string;
  option2: string;
  option3: string;
  option4: string;
  option5: string | null;
  answerChosen: string | null;
}

interface LeaderboardEntry {
  id: number;
  studentId: number;
  studentName: string;
  scoreObtained: number;
  totalScore: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  isLeaderboardPerformance: boolean;
  testType: string;
}

interface PerformanceDetail {
  id: number;
  testId: number;
  testName: string;
  testType: 'live' | 'recorded' | 'mock' | 'topic';
  testTopics: string[];
  topicName?: string;
  grade?: string;
  remark?: string;
  scoreObtained: number;
  totalScore: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  showAnswers: boolean;
  previousScoreObtained?: number;
  previousTotalScore?: number;
  testItem: { startTime: string; endTime: string };
  questions: Question[];
  leaderboard: LeaderboardEntry[];
}

@Component({
  standalone: false,
  selector: 'app-performance-detail',
  templateUrl: './performance-detail.component.html',
  styleUrl: './performance-detail.component.css',
})
export class PerformanceDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('pdSplit') pdSplit!: ElementRef;
  @ViewChild('pdLeft') pdLeft!: ElementRef;
  @ViewChild('pdRight') pdRight!: ElementRef;

  leftStickyTop = 0;
  rightStickyTop = 0;
  private resizeObserver?: ResizeObserver;

  testId!: number;
  performance!: PerformanceDetail;
  activeFilter: 'all' | 'correct' | 'incorrect' | 'skipped' = 'all';

  // Static data — replace with API call when backend is ready
  private readonly STATIC_DATA: PerformanceDetail = {
    id: 216,
    testId: 1,
    testName: 'ENGLISH PYQ 1',
    testType: 'mock',
    testTopics: ['PYQ'],
    grade: 'F',
    remark: 'Early stages, pick up the pace, you can do better.',
    scoreObtained: -1,
    totalScore: 250,
    correct: 0,
    incorrect: 1,
    unattempted: 49,
    showAnswers: true,
    testItem: {
      startTime: '2026-04-22T03:38:31.784Z',
      endTime: '2026-04-22T04:10:01.733Z',
    },
    leaderboard: [
      { id: 113, studentId: 19, studentName: 'Daniyal Khan', scoreObtained: 217, totalScore: 250, correct: 44, incorrect: 3, unattempted: 3, isLeaderboardPerformance: true, testType: 'mock' },
      { id: 125, studentId: 23, studentName: 'Abhishek Singh', scoreObtained: 186, totalScore: 250, correct: 39, incorrect: 9, unattempted: 2, isLeaderboardPerformance: true, testType: 'mock' },
      { id: 127, studentId: 50, studentName: 'Rupesh Kumar Jha', scoreObtained: 182, totalScore: 250, correct: 38, incorrect: 8, unattempted: 4, isLeaderboardPerformance: true, testType: 'mock' },
      { id: 105, studentId: 26, studentName: 'md umair ansari', scoreObtained: 168, totalScore: 250, correct: 35, incorrect: 7, unattempted: 8, isLeaderboardPerformance: true, testType: 'mock' },
      { id: 116, studentId: 43, studentName: 'Shama Parvin', scoreObtained: 146, totalScore: 250, correct: 32, incorrect: 14, unattempted: 4, isLeaderboardPerformance: true, testType: 'mock' },
      { id: 123, studentId: 22, studentName: 'Nisha Paravin', scoreObtained: 136, totalScore: 250, correct: 31, incorrect: 19, unattempted: 0, isLeaderboardPerformance: true, testType: 'mock' },
      { id: 145, studentId: 30, studentName: 'Shivam Singh', scoreObtained: 129, totalScore: 250, correct: 28, incorrect: 11, unattempted: 11, isLeaderboardPerformance: true, testType: 'mock' },
      { id: 117, studentId: 21, studentName: 'ritika Kumari', scoreObtained: 128, totalScore: 250, correct: 29, incorrect: 17, unattempted: 4, isLeaderboardPerformance: true, testType: 'mock' },
      { id: 216, studentId: 1, testType: 'mock', studentName: 'You', scoreObtained: -1, totalScore: 250, correct: 0, incorrect: 1, unattempted: 49, isLeaderboardPerformance: false },
    ],
    questions: [
      { id: 562, question: 'Read the passage given below to answer question number 1 to 6\n\nFrom the time we are born...\n\nQ1. In the passage a word that can replace \'look back and remember\' is:', correctOption: 'Recall', option2: 'Feelings', option3: 'Thoughts', option4: 'Memories', option5: null, answerChosen: 'Thoughts' },
      { id: 563, question: 'Q2. As adults we find it difficult to imagine a world without language because:', correctOption: 'We have learned it naturally and organically.', option2: 'We have found other ways to communicate', option3: 'Communication has become easier because of mobile phones.', option4: 'Language is not difficult to learn', option5: null, answerChosen: null },
      { id: 564, question: 'Q3. In the passage, the meaning of the word \'acquiring\' (a language) is:', correctOption: 'Learning (a language)', option2: 'Talking (a language)', option3: 'Teaching (a language)', option4: 'Giving (a language)', option5: null, answerChosen: null },
      { id: 562, question: 'Read the passage given below to answer question number 1 to 6\n\nFrom the time we are born...\n\nQ1. In the passage a word that can replace \'look back and remember\' is:', correctOption: 'Recall', option2: 'Feelings', option3: 'Thoughts', option4: 'Memories', option5: null, answerChosen: 'Thoughts' },
      { id: 563, question: 'Q2. As adults we find it difficult to imagine a world without language because:', correctOption: 'We have learned it naturally and organically.', option2: 'We have found other ways to communicate', option3: 'Communication has become easier because of mobile phones.', option4: 'Language is not difficult to learn', option5: null, answerChosen: null },
      { id: 564, question: 'Q3. In the passage, the meaning of the word \'acquiring\' (a language) is:', correctOption: 'Learning (a language)', option2: 'Talking (a language)', option3: 'Teaching (a language)', option4: 'Giving (a language)', option5: null, answerChosen: null },
      { id: 562, question: 'Read the passage given below to answer question number 1 to 6\n\nFrom the time we are born...\n\nQ1. In the passage a word that can replace \'look back and remember\' is:', correctOption: 'Recall', option2: 'Feelings', option3: 'Thoughts', option4: 'Memories', option5: null, answerChosen: 'Thoughts' },
      { id: 563, question: 'Q2. As adults we find it difficult to imagine a world without language because:', correctOption: 'We have learned it naturally and organically.', option2: 'We have found other ways to communicate', option3: 'Communication has become easier because of mobile phones.', option4: 'Language is not difficult to learn', option5: null, answerChosen: null },
      { id: 564, question: 'Q3. In the passage, the meaning of the word \'acquiring\' (a language) is:', correctOption: 'Learning (a language)', option2: 'Talking (a language)', option3: 'Teaching (a language)', option4: 'Giving (a language)', option5: null, answerChosen: null },
      { id: 562, question: 'Read the passage given below to answer question number 1 to 6\n\nFrom the time we are born...\n\nQ1. In the passage a word that can replace \'look back and remember\' is:', correctOption: 'Recall', option2: 'Feelings', option3: 'Thoughts', option4: 'Memories', option5: null, answerChosen: 'Thoughts' },
      { id: 563, question: 'Q2. As adults we find it difficult to imagine a world without language because:', correctOption: 'We have learned it naturally and organically.', option2: 'We have found other ways to communicate', option3: 'Communication has become easier because of mobile phones.', option4: 'Language is not difficult to learn', option5: null, answerChosen: null },
      { id: 564, question: 'Q3. In the passage, the meaning of the word \'acquiring\' (a language) is:', correctOption: 'Learning (a language)', option2: 'Talking (a language)', option3: 'Teaching (a language)', option4: 'Giving (a language)', option5: null, answerChosen: null },
    ],
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.testId = Number(this.route.snapshot.paramMap.get('testId'));
    // TODO: replace with API call: this.http.getApi(`get-performance-detail/${this.testId}`, {})
    this.performance = this.STATIC_DATA;
  }

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(() => {
        this.calculateOffsets();
      });

      if (this.pdSplit) this.resizeObserver.observe(this.pdSplit.nativeElement);
      if (this.pdLeft) this.resizeObserver.observe(this.pdLeft.nativeElement);
      if (this.pdRight) this.resizeObserver.observe(this.pdRight.nativeElement);

      // Initial calculation
      setTimeout(() => this.calculateOffsets(), 100);
    }
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  calculateOffsets(): void {
    if (!this.pdLeft || !this.pdRight) return;

    const vh = window.innerHeight;
    const padding = 24; // Standard padding/gap

    const leftHeight = this.pdLeft.nativeElement.offsetHeight;
    const rightHeight = this.pdRight.nativeElement.offsetHeight;

    // Logic: If column is taller than viewport, we stick it so the bottom is visible
    // Offset = ViewportHeight - ColumnHeight - Padding
    this.leftStickyTop = leftHeight + padding > vh ? vh - leftHeight - padding : 24;
    this.rightStickyTop = rightHeight + padding > vh ? vh - rightHeight - padding : 24;

    this.cdr.detectChanges();
  }

  goBack(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  setFilter(filter: 'all' | 'correct' | 'incorrect' | 'skipped'): void {
    this.activeFilter = filter;
  }

  get scorePct(): number | null {
    if (!this.performance?.totalScore) return null;
    return (this.performance.scoreObtained / this.performance.totalScore) * 100;
  }

  get accuracyLabel(): string {
    if (this.scorePct === null) return '—';
    return (this.scorePct >= 0 ? '' : '') + this.scorePct.toFixed(2) + '%';
  }

  get scoreAvgLabel(): string {
    if (this.scorePct === null) return '';
    return this.scorePct >= 50 ? 'Above average' : 'Below average';
  }

  get duration(): string {
    if (!this.performance?.testItem?.startTime || !this.performance?.testItem?.endTime) return '—';
    const diff = Math.abs(
      new Date(this.performance.testItem.endTime).getTime() -
      new Date(this.performance.testItem.startTime).getTime()
    );
    const totalSec = Math.floor(diff / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min} min ${sec} sec`;
  }

  get correctCount(): number { return this.performance?.correct ?? 0; }
  get incorrectCount(): number { return this.performance?.incorrect ?? 0; }
  get skippedCount(): number { return this.performance?.unattempted ?? 0; }
  get totalQ(): number { return this.correctCount + this.incorrectCount + this.skippedCount; }

  get correctPct(): number { return this.totalQ ? (this.correctCount / this.totalQ) * 100 : 0; }
  get incorrectPct(): number { return this.totalQ ? (this.incorrectCount / this.totalQ) * 100 : 0; }

  get filteredQuestions(): Question[] {
    if (!this.performance?.questions) return [];
    switch (this.activeFilter) {
      case 'correct':   return this.performance.questions.filter(q => q.answerChosen === q.correctOption);
      case 'incorrect': return this.performance.questions.filter(q => q.answerChosen !== null && q.answerChosen !== q.correctOption);
      case 'skipped':   return this.performance.questions.filter(q => q.answerChosen === null);
      default:          return this.performance.questions;
    }
  }

  getQuestionOptions(q: Question): { val: string; label: string }[] {
    return [
      { val: q.option2, label: 'Option B' },
      { val: q.option3, label: 'Option C' },
      { val: q.option4, label: 'Option D' },
      ...(q.option5 ? [{ val: q.option5, label: 'Option E' }] : []),
    ];
  }

  getQuestionStatus(q: Question): 'correct' | 'incorrect' | 'skipped' {
    if (q.answerChosen === null) return 'skipped';
    return q.answerChosen === q.correctOption ? 'correct' : 'incorrect';
  }

  getLbPct(entry: LeaderboardEntry): string {
    if (!entry.totalScore) return '—';
    return ((entry.scoreObtained / entry.totalScore) * 100).toFixed(1) + '%';
  }

  isCurrentStudent(entry: LeaderboardEntry): boolean {
    return entry.studentId === this.performance?.leaderboard?.find(e => !e.isLeaderboardPerformance)?.studentId
      || entry.id === this.performance?.id;
  }
}
