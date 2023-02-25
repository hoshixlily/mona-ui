import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridFilterMenuComponent } from './grid-filter-menu.component';

describe('GridFilterMenuComponent', () => {
  let component: GridFilterMenuComponent;
  let fixture: ComponentFixture<GridFilterMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridFilterMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridFilterMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
