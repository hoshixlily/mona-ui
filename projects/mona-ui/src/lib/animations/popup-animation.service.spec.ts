import { TestBed } from '@angular/core/testing';

import { PopupAnimationService } from './popup-animation.service';

describe('PopupAnimationService', () => {
  let service: PopupAnimationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopupAnimationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
