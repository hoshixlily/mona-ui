import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorTableCreatorComponent } from './editor-table-creator.component';

describe('EditorTableCreatorComponent', () => {
  let component: EditorTableCreatorComponent;
  let fixture: ComponentFixture<EditorTableCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorTableCreatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditorTableCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
