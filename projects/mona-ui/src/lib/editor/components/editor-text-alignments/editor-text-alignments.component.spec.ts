import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorTextAlignmentsComponent } from './editor-text-alignments.component';

describe('EditorTextAlignmentsComponent', () => {
  let component: EditorTextAlignmentsComponent;
  let fixture: ComponentFixture<EditorTextAlignmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorTextAlignmentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditorTextAlignmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
