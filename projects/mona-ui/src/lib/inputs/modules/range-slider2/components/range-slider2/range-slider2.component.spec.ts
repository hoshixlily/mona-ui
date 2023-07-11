import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeSlider2Component } from './range-slider2.component';

describe('RangeSlider2Component', () => {
  let component: RangeSlider2Component;
  let fixture: ComponentFixture<RangeSlider2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RangeSlider2Component]
    });
    fixture = TestBed.createComponent(RangeSlider2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
