import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorFontHighlightComponent } from './editor-font-highlight.component';

describe('EditorFontHighlightComponent', () => {
  let component: EditorFontHighlightComponent;
  let fixture: ComponentFixture<EditorFontHighlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorFontHighlightComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditorFontHighlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
