import { TestBed } from '@angular/core/testing';

import { BitrixItestService } from './bitrix-itest.service';

describe('BitrixItestService', () => {
  let service: BitrixItestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BitrixItestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
