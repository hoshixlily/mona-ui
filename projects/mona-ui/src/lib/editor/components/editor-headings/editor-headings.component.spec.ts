import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorHeadingsComponent } from './editor-headings.component';

describe('EditorHeadingsComponent', () => {
  let component: EditorHeadingsComponent;
  let fixture: ComponentFixture<EditorHeadingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorHeadingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditorHeadingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
