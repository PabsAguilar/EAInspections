import { TestBed } from '@angular/core/testing';

import { SyncInspectionService } from './sync-inspection.service';

describe('SyncInspectionService', () => {
  let service: SyncInspectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SyncInspectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
