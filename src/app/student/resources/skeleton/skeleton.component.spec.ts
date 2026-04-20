import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceSkeletonComponent } from './skeleton.component';

describe('ResourceSkeletonComponent', () => {
  let component: ResourceSkeletonComponent;
  let fixture: ComponentFixture<ResourceSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResourceSkeletonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceSkeletonComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('items returns array of length equal to count', () => {
    component.count = 4;
    expect(component.items.length).toBe(4);
  });

  it('items returns array of length 1 by default', () => {
    expect(component.items.length).toBe(1);
  });

  it('items values are indices 0..count-1', () => {
    component.count = 3;
    expect(component.items).toEqual([0, 1, 2]);
  });
});
