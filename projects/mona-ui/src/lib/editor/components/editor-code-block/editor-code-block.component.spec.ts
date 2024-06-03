import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorCodeBlockComponent } from './editor-code-block.component';

describe('EditorCodeBlockComponent', () => {
  let component: EditorCodeBlockComponent;
  let fixture: ComponentFixture<EditorCodeBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorCodeBlockComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditorCodeBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
