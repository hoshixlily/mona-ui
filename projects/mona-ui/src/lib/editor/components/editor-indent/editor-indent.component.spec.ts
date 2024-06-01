import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorIndentComponent } from './editor-indent.component';

describe('EditorIndentComponent', () => {
  let component: EditorIndentComponent;
  let fixture: ComponentFixture<EditorIndentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorIndentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditorIndentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
