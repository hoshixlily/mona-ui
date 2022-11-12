import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeViewNodeComponent } from './tree-view-node.component';

describe('TreeViewNodeComponent', () => {
  let component: TreeViewNodeComponent;
  let fixture: ComponentFixture<TreeViewNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreeViewNodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreeViewNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
