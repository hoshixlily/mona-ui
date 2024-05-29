import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorFontColorComponent } from './editor-font-color.component';

describe('EditorFontColorComponent', () => {
  let component: EditorFontColorComponent;
  let fixture: ComponentFixture<EditorFontColorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorFontColorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditorFontColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
