import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeoSplitterComponent } from './neo-splitter.component';

describe('NeoSplitterComponent', () => {
  let component: NeoSplitterComponent;
  let fixture: ComponentFixture<NeoSplitterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeoSplitterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NeoSplitterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
