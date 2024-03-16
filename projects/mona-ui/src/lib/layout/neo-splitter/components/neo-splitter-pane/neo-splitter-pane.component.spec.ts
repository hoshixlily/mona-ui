import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeoSplitterPaneComponent } from './neo-splitter-pane.component';

describe('NeoSplitterPaneComponent', () => {
  let component: NeoSplitterPaneComponent;
  let fixture: ComponentFixture<NeoSplitterPaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeoSplitterPaneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NeoSplitterPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
