import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ResourcesComponent } from './resources.component';
import { HttpService } from '../../shared/services/http.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ResourceTopicPanelComponent } from './topic-panel/topic-panel.component';
import { ResourceSkeletonComponent } from './skeleton/skeleton.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';


const defaultTopicsResponse = {
  data: {
    topics: [
      { id: 10, name: 'Nouns', material: 2, chapterName: 'Grammar' },
      { id: 11, name: 'Verbs', material: 1, chapterName: 'Grammar' },
      { id: 12, name: 'Reading', material: 3 },
    ],
    subjectName: 'English',
  },
};

const mockHttp = {
  getSubjects: jasmine.createSpy('getSubjects').and.returnValue(of({
    data: [
      { id: 1, name: 'English', isDomain: false, topic: 5 },
      { id: 2, name: 'History', isDomain: true, topic: 3 },
    ]
  })),
  getTopics: jasmine.createSpy('getTopics').and.returnValue(of(defaultTopicsResponse)),
  getVideoLinks: jasmine.createSpy('getVideoLinks').and.returnValue(of({ data: { videoLinks: [], total: 0 } })),
  getNewspapers: jasmine.createSpy('getNewspapers').and.returnValue(of({ data: { newspapers: [], total: 0 } })),
  getPYQs: jasmine.createSpy('getPYQs').and.returnValue(of({ data: [] })),
  checkUnfinishedTest: jasmine.createSpy('checkUnfinishedTest').and.returnValue(of({ data: null })),
  postSubmitTest: jasmine.createSpy('postSubmitTest').and.returnValue(of({})),
  postLogAccess: jasmine.createSpy('postLogAccess').and.returnValue(of({})),
};

const mockMessage = {
  success: jasmine.createSpy('success'),
  error: jasmine.createSpy('error'),
};

describe('ResourcesComponent', () => {
  let component: ResourcesComponent;
  let fixture: ComponentFixture<ResourcesComponent>;

  beforeEach(async () => {
    Object.values(mockHttp).forEach((spy: any) => spy.calls?.reset?.());
    mockHttp.getTopics.and.returnValue(of(defaultTopicsResponse));

    await TestBed.configureTestingModule({
      declarations: [ResourcesComponent, ResourceTopicPanelComponent, ResourceSkeletonComponent],
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        { provide: HttpService, useValue: mockHttp },
        { provide: NzMessageService, useValue: mockMessage },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourcesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('loads subjects on init without auto-selecting any', () => {
    fixture.detectChanges();
    expect(mockHttp.getSubjects).toHaveBeenCalled();
    expect(component.selectedSubjectId).toBeNull();
  });

  it('subjectsState is loaded after init', () => {
    fixture.detectChanges();
    expect(component.subjectsState.status).toBe('loaded');
    if (component.subjectsState.status === 'loaded') {
      expect(component.subjectsState.data.nonDomain.length).toBe(1);
      expect(component.subjectsState.data.domain.length).toBe(1);
    }
  });

  it('toggleSubject opens a subject and loads topics', () => {
    fixture.detectChanges();
    component.toggleSubject({ id: 1, name: 'English' });
    expect(component.selectedSubjectId).toBe(1);
    expect(mockHttp.getTopics).toHaveBeenCalledWith({ subjectId: 1 });
  });

  it('toggleSubject collapses an already-open subject', () => {
    fixture.detectChanges();
    component.toggleSubject({ id: 1, name: 'English' });
    component.toggleSubject({ id: 1, name: 'English' });
    expect(component.selectedSubjectId).toBeNull();
  });

  it('topicGroups groups topics by chapter field', () => {
    fixture.detectChanges();
    component.toggleSubject({ id: 1, name: 'English' });

    const groups = component.topicGroups;
    expect(groups.length).toBe(2);
    const grammar = groups.find(g => g.title === 'Grammar');
    expect(grammar).toBeTruthy();
    expect(grammar!.topics.length).toBe(2);
    const fallback = groups.find(g => g.title === 'Topics');
    expect(fallback!.topics.length).toBe(1);
  });

  it('excludes topics with no notes', () => {
    mockHttp.getTopics.and.returnValue(of({
      data: {
        topics: [
          { id: 10, name: 'Empty', material: 0, chapterName: 'A' },
          { id: 11, name: 'Has notes', material: 2, chapterName: 'A' },
        ],
        subjectName: 'English',
      },
    }));
    fixture.detectChanges();
    component.toggleSubject({ id: 1, name: 'English' });
    const titles = component.topicGroups.flatMap((g) => g.topics.map((t) => t.name));
    expect(titles).toEqual(['Has notes']);
  });

  it('when topicTests is an integer, requires topicTests > 0', () => {
    mockHttp.getTopics.and.returnValue(of({
      data: {
        topics: [
          { id: 10, name: 'No tests', material: 2, topicTests: 0, chapterName: 'A' },
          { id: 11, name: 'Has tests', material: 1, topicTests: 2, chapterName: 'A' },
        ],
        subjectName: 'English',
      },
    }));
    fixture.detectChanges();
    component.toggleSubject({ id: 1, name: 'English' });
    const titles = component.topicGroups.flatMap((g) => g.topics.map((t) => t.name));
    expect(titles).toEqual(['Has tests']);
  });

  it('ignores non-integer topicTests and keeps topics with notes', () => {
    mockHttp.getTopics.and.returnValue(of({
      data: {
        topics: [
          { id: 10, name: 'String count', material: 2, topicTests: '1', chapterName: 'A' },
          { id: 11, name: 'NaN', material: 1, topicTests: NaN, chapterName: 'A' },
        ],
        subjectName: 'English',
      },
    }));
    fixture.detectChanges();
    component.toggleSubject({ id: 1, name: 'English' });
    const titles = component.topicGroups.flatMap((g) => g.topics.map((t) => t.name)).sort();
    expect(titles).toEqual(['NaN', 'String count']);
  });

  it('selectTopic sets selectedTopicId', () => {
    fixture.detectChanges();
    component.selectTopic({ id: 10, name: 'Nouns' });
    expect(component.selectedTopicId).toBe(10);
  });

  it('selectTopic on same topic clears selection (toggle)', () => {
    fixture.detectChanges();
    component.selectTopic({ id: 10, name: 'Nouns' });
    component.selectTopic({ id: 10, name: 'Nouns' });
    expect(component.selectedTopicId).toBeNull();
  });

  it('onClickStartTest opens start-test modal when test canAttempt and no pending test', () => {
    fixture.detectChanges();
    component.onClickStartTest({ id: 5, canAttempt: true }, 'topic');
    expect(component.isStartTestModal).toBeTrue();
    expect(component.selectedTest?.id).toBe(5);
  });

  it('onClickStartTest opens invalid modal when test cannot be attempted', () => {
    fixture.detectChanges();
    component.onClickStartTest({ id: 5, canAttempt: false }, 'topic');
    expect(component.isInvalidModal).toBeTrue();
  });

  it('onModalClose resets all modal state', () => {
    fixture.detectChanges();
    component.isStartTestModal = true;
    component.isInvalidModal = true;
    component.isPendingTest = true;
    component.onModalClose();
    expect(component.isStartTestModal).toBeFalse();
    expect(component.isInvalidModal).toBeFalse();
    expect(component.isPendingTest).toBeFalse();
  });
});
