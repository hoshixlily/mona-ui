import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowContentComponent } from './window-content.component';

describe('WindowContentComponent', () => {
  let component: WindowContentComponent;
  let fixture: ComponentFixture<WindowContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WindowContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WindowContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
