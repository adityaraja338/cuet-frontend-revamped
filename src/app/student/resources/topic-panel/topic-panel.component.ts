import {
  Component, Input, Output, EventEmitter, OnInit, OnDestroy
} from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { debounceTime, finalize, takeUntil } from 'rxjs/operators';
import { HttpService } from '../../../shared/services/http.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AsyncState } from '../resources.component';

@Component({
  standalone: false,
  selector: 'app-resource-topic-panel',
  templateUrl: './topic-panel.component.html',
  styleUrl: './topic-panel.component.css',
})
export class ResourceTopicPanelComponent implements OnInit, OnDestroy {
  @Input({ required: true }) topicId!: number;
  @Input() topicName: string = '';

  @Output() startTest = new EventEmitter<{ test: any; testType: string }>();
  @Output() invalidAccess = new EventEmitter<void>();

  materialsState: AsyncState<any[]> = { status: 'idle' };
  testsState: AsyncState<{ items: any[]; total: number }> = { status: 'idle' };

  pageIndex = 1;
  pageSize = 10;
  searchTest = '';
  isTestsReloading = false;

  private readonly searchSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  protected readonly Math = Math;

  constructor(
    private readonly http: HttpService,
    private readonly message: NzMessageService,
  ) {}

  ngOnInit(): void {
    this.loadPanel();

    this.searchSubject
      .pipe(debounceTime(400), takeUntil(this.destroy$))
      .subscribe((value) => {
        this.searchTest = value;
        this.pageIndex = 1;
        this.reloadTests();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPanel(): void {
    this.materialsState = { status: 'loading' };
    this.testsState = { status: 'loading' };

    forkJoin({
      materials: this.http.getMaterials({ topicId: this.topicId }),
      tests: this.http.getTopicTests({
        topicId: this.topicId,
        page: this.pageIndex,
        limit: this.pageSize,
      }),
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res: any) => {
        this.materialsState = {
          status: 'loaded',
          data: res.materials?.data?.materials ?? [],
        };
        this.testsState = {
          status: 'loaded',
          data: {
            items: res.tests?.data?.tests ?? [],
            total: res.tests?.data?.total ?? 0,
          },
        };
      },
      error: (error: any) => {
        this.materialsState = {
          status: 'error',
          message: error?.error?.message ?? 'Failed to load materials',
        };
        this.testsState = {
          status: 'error',
          message: error?.error?.message ?? 'Failed to load tests',
        };
        this.message?.error(error?.error?.message);
      },
    });
  }

  reloadTests(event?: any): void {
    if (event) {
      this.pageIndex = event.pageIndex ?? this.pageIndex;
      this.pageSize = event.pageSize ?? this.pageSize;
    }

    const data: any = {
      topicId: this.topicId,
      page: this.pageIndex,
      limit: this.pageSize,
    };
    if (this.searchTest) {
      data['search'] = this.searchTest;
    }

    this.isTestsReloading = true;
    this.http
      .getTopicTests(data)
      .pipe(finalize(() => (this.isTestsReloading = false)), takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.testsState = {
            status: 'loaded',
            data: {
              items: res?.data?.tests ?? [],
              total: res?.data?.total ?? 0,
            },
          };
        },
        error: (error: any) => {
          this.message?.error(error?.error?.message);
        },
      });
  }

  onSearchChange(value: string): void {
    this.searchSubject.next(value);
  }

  onReadMaterial(id: number): void {
    this.http
      .postLogAccess({ itemId: id, itemType: 'material' })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: (error: any) => this.message?.error(error?.error?.message),
      });
  }

  onStartTestClick(test: any, testType: string): void {
    this.startTest.emit({ test, testType });
  }

  onLockedClick(): void {
    this.invalidAccess.emit();
  }
}
