import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorBasicTextStylesComponent } from './editor-basic-text-styles.component';

describe('EditorBasicTextStylesComponent', () => {
  let component: EditorBasicTextStylesComponent;
  let fixture: ComponentFixture<EditorBasicTextStylesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorBasicTextStylesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditorBasicTextStylesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
