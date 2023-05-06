import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupWrapperComponent } from './popup-wrapper.component';

describe('PopupWrapperComponent', () => {
  let component: PopupWrapperComponent;
  let fixture: ComponentFixture<PopupWrapperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopupWrapperComponent]
    });
    fixture = TestBed.createComponent(PopupWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
