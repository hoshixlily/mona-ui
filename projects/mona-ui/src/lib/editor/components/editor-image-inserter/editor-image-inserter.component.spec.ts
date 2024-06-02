import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorImageInserterComponent } from './editor-image-inserter.component';

describe('EditorImageInserterComponent', () => {
  let component: EditorImageInserterComponent;
  let fixture: ComponentFixture<EditorImageInserterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorImageInserterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditorImageInserterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
