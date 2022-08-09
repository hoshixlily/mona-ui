import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuItemComponent } from './context-menu-item.component';

describe('ContextMenuItemComponent', () => {
  let component: ContextMenuItemComponent;
  let fixture: ComponentFixture<ContextMenuItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContextMenuItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContextMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
