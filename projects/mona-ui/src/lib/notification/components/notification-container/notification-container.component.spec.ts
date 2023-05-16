import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationContainerComponent } from './notification-container.component';

describe('NotificationContainerComponent', () => {
  let component: NotificationContainerComponent;
  let fixture: ComponentFixture<NotificationContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationContainerComponent]
    });
    fixture = TestBed.createComponent(NotificationContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
