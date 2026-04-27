import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerformancesComponent } from './performances.component';
import { HttpService } from '../../shared/services/http.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { NgZorroAntdModule } from '../../ng-zorro-antd.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

describe('PerformancesComponent', () => {
  let component: PerformancesComponent;
  let fixture: ComponentFixture<PerformancesComponent>;

  const mockHttpService = {
    getApi: jasmine.createSpy('getApi').and.returnValue(of({ data: { performances: [], total: 0 } }))
  };

  const mockNzMessageService = {
    error: jasmine.createSpy('error')
  };

  const mockActivatedRoute = {
    queryParams: of({})
  };

  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PerformancesComponent],
      imports: [NgZorroAntdModule, RouterModule.forRoot([]), CommonModule],
      providers: [
        { provide: HttpService, useValue: mockHttpService },
        { provide: NzMessageService, useValue: mockNzMessageService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PerformancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
