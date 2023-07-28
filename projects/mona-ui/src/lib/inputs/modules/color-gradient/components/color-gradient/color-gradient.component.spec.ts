import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorGradientComponent } from './color-gradient.component';

describe('ColorGradientComponent', () => {
  let component: ColorGradientComponent;
  let fixture: ComponentFixture<ColorGradientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ColorGradientComponent]
    });
    fixture = TestBed.createComponent(ColorGradientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
