import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorLinkComponent } from './editor-link.component';

describe('EditorLinkComponent', () => {
  let component: EditorLinkComponent;
  let fixture: ComponentFixture<EditorLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorLinkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditorLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
