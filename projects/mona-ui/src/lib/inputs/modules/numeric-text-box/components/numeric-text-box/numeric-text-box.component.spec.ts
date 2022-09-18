import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumericTextBoxComponent } from './numeric-text-box.component';

describe('NumericTextBoxComponent', () => {
  let component: NumericTextBoxComponent;
  let fixture: ComponentFixture<NumericTextBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumericTextBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NumericTextBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
