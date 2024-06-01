import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorListComponent } from './editor-list.component';

describe('EditorListComponent', () => {
  let component: EditorListComponent;
  let fixture: ComponentFixture<EditorListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
