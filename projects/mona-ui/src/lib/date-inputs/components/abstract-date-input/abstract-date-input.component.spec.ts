import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbstractDateInputComponent } from './abstract-date-input.component';

describe('AbstractDateInputComponent', () => {
  let component: AbstractDateInputComponent;
  let fixture: ComponentFixture<AbstractDateInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AbstractDateInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbstractDateInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
