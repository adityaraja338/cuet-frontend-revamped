import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerformanceDetailComponent } from './performance-detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { NgZorroAntdModule } from '../../../ng-zorro-antd.module';
import { CommonModule } from '@angular/common';

describe('PerformanceDetailComponent', () => {
  let component: PerformanceDetailComponent;
  let fixture: ComponentFixture<PerformanceDetailComponent>;

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: () => '216'
      }
    }
  };

  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PerformanceDetailComponent],
      imports: [NgZorroAntdModule, CommonModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PerformanceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
