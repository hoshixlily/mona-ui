import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbstractSliderComponent } from './abstract-slider.component';

describe('AbstractSliderComponent', () => {
  let component: AbstractSliderComponent;
  let fixture: ComponentFixture<AbstractSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbstractSliderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbstractSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
