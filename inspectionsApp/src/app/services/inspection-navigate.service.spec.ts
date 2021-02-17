import { TestBed } from '@angular/core/testing';

import { InspectionNavigateService } from './inspection-navigate.service';

describe('InspectionNavigateService', () => {
  let service: InspectionNavigateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InspectionNavigateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
