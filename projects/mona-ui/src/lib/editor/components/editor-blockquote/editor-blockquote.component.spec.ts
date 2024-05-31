import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorBlockquoteComponent } from './editor-blockquote.component';

describe('EditorBlockquoteComponent', () => {
  let component: EditorBlockquoteComponent;
  let fixture: ComponentFixture<EditorBlockquoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorBlockquoteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditorBlockquoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
