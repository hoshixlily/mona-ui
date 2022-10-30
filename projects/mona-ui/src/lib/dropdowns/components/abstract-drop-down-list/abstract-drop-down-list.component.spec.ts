import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbstractDropDownListComponent } from './abstract-drop-down-list.component';

describe('AbstractDropDownListComponent', () => {
  let component: AbstractDropDownListComponent;
  let fixture: ComponentFixture<AbstractDropDownListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AbstractDropDownListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbstractDropDownListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
