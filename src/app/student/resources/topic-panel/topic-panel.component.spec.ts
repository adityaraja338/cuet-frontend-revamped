import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ResourceTopicPanelComponent } from './topic-panel.component';
import { HttpService } from '../../../shared/services/http.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NO_ERRORS_SCHEMA } from '@angular/core';

const mockHttpService = {
  getMaterials: jasmine.createSpy('getMaterials').and.returnValue(of({
    data: { materials: [{ id: 1, name: 'Mat A', url: 'https://example.com', isFree: true }] }
  })),
  getTopicTests: jasmine.createSpy('getTopicTests').and.returnValue(of({
    data: { tests: [{ id: 10, name: 'Test A', totalQuestions: 5, duration: 30, isFree: true, canAttempt: true }], total: 1 }
  })),
  postLogAccess: jasmine.createSpy('postLogAccess').and.returnValue(of({})),
};

const mockMessage = { error: jasmine.createSpy('error') };

describe('ResourceTopicPanelComponent', () => {
  let component: ResourceTopicPanelComponent;
  let fixture: ComponentFixture<ResourceTopicPanelComponent>;

  beforeEach(async () => {
    mockHttpService.getMaterials.calls.reset();
    mockHttpService.getMaterials.and.returnValue(of({
      data: { materials: [{ id: 1, name: 'Mat A', url: 'https://example.com', isFree: true }] }
    }));
    mockHttpService.getTopicTests.calls.reset();
    mockHttpService.getTopicTests.and.returnValue(of({
      data: { tests: [{ id: 10, name: 'Test A', totalQuestions: 5, duration: 30, isFree: true, canAttempt: true }], total: 1 }
    }));

    await TestBed.configureTestingModule({
      declarations: [ResourceTopicPanelComponent],
      providers: [
        { provide: HttpService, useValue: mockHttpService },
        { provide: NzMessageService, useValue: mockMessage },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceTopicPanelComponent);
    component = fixture.componentInstance;
    component.topicId = 42;
    component.topicName = 'Algebra';
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('loads materials and tests via forkJoin on init', () => {
    fixture.detectChanges();
    expect(mockHttpService.getMaterials).toHaveBeenCalledWith({ topicId: 42 });
    expect(mockHttpService.getTopicTests).toHaveBeenCalledWith({ topicId: 42, page: 1, limit: 10 });
  });

  it('materialsState is loaded after init', () => {
    fixture.detectChanges();
    expect(component.materialsState.status).toBe('loaded');
    if (component.materialsState.status === 'loaded') {
      expect(component.materialsState.data.length).toBe(1);
      expect(component.materialsState.data[0].name).toBe('Mat A');
    }
  });

  it('testsState is loaded after init', () => {
    fixture.detectChanges();
    expect(component.testsState.status).toBe('loaded');
    if (component.testsState.status === 'loaded') {
      expect(component.testsState.data.items.length).toBe(1);
      expect(component.testsState.data.total).toBe(1);
    }
  });

  it('emits startTest output when onStartTestClick is called', () => {
    fixture.detectChanges();
    const emitted: any[] = [];
    component.startTest.subscribe((v: any) => emitted.push(v));
    const test = { id: 10, canAttempt: true };
    component.onStartTestClick(test, 'topic');
    expect(emitted.length).toBe(1);
    expect(emitted[0]).toEqual({ test, testType: 'topic' });
  });

  it('emits invalidAccess output when onLockedClick is called', () => {
    fixture.detectChanges();
    let emitted = false;
    component.invalidAccess.subscribe(() => (emitted = true));
    component.onLockedClick();
    expect(emitted).toBeTrue();
  });

  it('sets error status when getMaterials fails', () => {
    mockHttpService.getMaterials.and.returnValue(throwError(() => ({ error: { message: 'fail' } })));
    fixture.detectChanges();
    expect(component.materialsState.status).toBe('error');
  });
});
