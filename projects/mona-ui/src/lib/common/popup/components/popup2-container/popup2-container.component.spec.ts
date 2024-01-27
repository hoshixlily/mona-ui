import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Popup2ContainerComponent } from './popup2-container.component';

describe('Popup2ContainerComponent', () => {
  let component: Popup2ContainerComponent;
  let fixture: ComponentFixture<Popup2ContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Popup2ContainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Popup2ContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
