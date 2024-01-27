import { TestBed } from '@angular/core/testing';

import { Popup2Service } from './popup2.service';

describe('Popup2Service', () => {
  let service: Popup2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Popup2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
