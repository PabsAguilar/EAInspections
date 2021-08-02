import { TestBed } from '@angular/core/testing';

import { BitrixTokenSetupService } from './bitrix-token-setup.service';

describe('BitrixTokenSetupService', () => {
  let service: BitrixTokenSetupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BitrixTokenSetupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
