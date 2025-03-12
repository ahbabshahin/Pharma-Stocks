import { TestBed } from '@angular/core/testing';

import { SalesReportApiService } from './sales-report-api.service';

describe('SalesReportApiService', () => {
  let service: SalesReportApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesReportApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
