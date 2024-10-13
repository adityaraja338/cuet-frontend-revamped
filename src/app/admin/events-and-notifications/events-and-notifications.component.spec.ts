import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsAndNotificationsComponent } from './events-and-notifications.component';

describe('EventsAndNotificationsComponent', () => {
  let component: EventsAndNotificationsComponent;
  let fixture: ComponentFixture<EventsAndNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventsAndNotificationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventsAndNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
