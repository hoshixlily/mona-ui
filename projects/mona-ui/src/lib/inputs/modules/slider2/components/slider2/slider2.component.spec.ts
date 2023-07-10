import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Slider2Component } from './slider2.component';

describe('Slider2Component', () => {
  let component: Slider2Component;
  let fixture: ComponentFixture<Slider2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Slider2Component]
    });
    fixture = TestBed.createComponent(Slider2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
