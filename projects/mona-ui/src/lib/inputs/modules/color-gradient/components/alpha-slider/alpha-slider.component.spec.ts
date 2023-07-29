import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaSliderComponent } from './alpha-slider.component';

describe('AlphaSliderComponent', () => {
  let component: AlphaSliderComponent;
  let fixture: ComponentFixture<AlphaSliderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlphaSliderComponent]
    });
    fixture = TestBed.createComponent(AlphaSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
