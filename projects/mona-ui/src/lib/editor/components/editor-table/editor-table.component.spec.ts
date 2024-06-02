import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorTableComponent } from './editor-table.component';

describe('EditorTableComponent', () => {
  let component: EditorTableComponent;
  let fixture: ComponentFixture<EditorTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditorTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
