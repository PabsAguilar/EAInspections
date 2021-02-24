import { TestBed } from '@angular/core/testing';

import { ItestDealService } from './itest-deal.service';

describe('ItestDealService', () => {
  let service: ItestDealService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItestDealService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
