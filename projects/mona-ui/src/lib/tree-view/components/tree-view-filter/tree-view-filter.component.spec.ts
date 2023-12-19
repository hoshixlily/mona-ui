import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeViewFilterComponent } from './tree-view-filter.component';

describe('TreeViewFilterComponent', () => {
  let component: TreeViewFilterComponent;
  let fixture: ComponentFixture<TreeViewFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeViewFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TreeViewFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
