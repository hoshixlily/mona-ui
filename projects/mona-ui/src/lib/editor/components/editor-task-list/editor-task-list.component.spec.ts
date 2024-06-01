import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorTaskListComponent } from './editor-task-list.component';

describe('EditorTaskListComponent', () => {
  let component: EditorTaskListComponent;
  let fixture: ComponentFixture<EditorTaskListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorTaskListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditorTaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
