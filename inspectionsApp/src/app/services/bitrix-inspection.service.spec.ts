import { TestBed } from '@angular/core/testing';

import { BitrixInspectionService } from './bitrix-inspection.service';

describe('BitrixInspectionService', () => {
  let service: BitrixInspectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BitrixInspectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
