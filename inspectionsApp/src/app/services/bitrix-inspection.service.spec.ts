import { TestBed } from "@angular/core/testing";

import { BitrixENService } from "./bitrix-inspection.service";

describe("BitrixInspectionService", () => {
  let service: BitrixENService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BitrixENService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
