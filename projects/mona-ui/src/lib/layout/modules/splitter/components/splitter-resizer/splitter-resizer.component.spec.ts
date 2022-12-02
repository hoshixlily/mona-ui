import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SplitterResizerComponent } from './splitter-resizer.component';

describe('SplitterResizerComponent', () => {
  let component: SplitterResizerComponent;
  let fixture: ComponentFixture<SplitterResizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SplitterResizerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SplitterResizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
