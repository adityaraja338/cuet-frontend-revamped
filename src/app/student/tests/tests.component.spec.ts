import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestsComponent } from './tests.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { HttpService } from '../../shared/services/http.service';

describe('TestsComponent', () => {
  let component: TestsComponent;
  let fixture: ComponentFixture<TestsComponent>;

  const mockHttp = {
    getRecordedAndMockTests: jasmine.createSpy('getRecordedAndMockTests').and.returnValue(of({ data: { recordedTests: [], mockTests: [] } })),
    getAllTopicTests: jasmine.createSpy('getAllTopicTests').and.returnValue(of({ data: { topicTests: [], total: 0 } })),
    getAllTopics: jasmine.createSpy('getAllTopics').and.returnValue(of({ data: { topics: [] } })),
    checkUnfinishedTest: jasmine.createSpy('checkUnfinishedTest').and.returnValue(of({ data: null })),
  };

  const mockMessage = {
    error: jasmine.createSpy('error'),
    success: jasmine.createSpy('success'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestsComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: HttpService, useValue: mockHttp },
        { provide: NzMessageService, useValue: mockMessage },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
