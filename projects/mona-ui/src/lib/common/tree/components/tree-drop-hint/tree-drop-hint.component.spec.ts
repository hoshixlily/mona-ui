import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeDropHintComponent } from './tree-drop-hint.component';

describe('TreeDropHintComponent', () => {
  let component: TreeDropHintComponent;
  let fixture: ComponentFixture<TreeDropHintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeDropHintComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TreeDropHintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
