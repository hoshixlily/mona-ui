import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorFontSizeComponent } from './editor-font-size.component';

describe('EditorFontSizeComponent', () => {
  let component: EditorFontSizeComponent;
  let fixture: ComponentFixture<EditorFontSizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorFontSizeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditorFontSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
