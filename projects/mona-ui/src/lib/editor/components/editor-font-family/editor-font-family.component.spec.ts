import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorFontFamilyComponent } from './editor-font-family.component';

describe('EditorFontFamilyComponent', () => {
  let component: EditorFontFamilyComponent;
  let fixture: ComponentFixture<EditorFontFamilyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorFontFamilyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditorFontFamilyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
