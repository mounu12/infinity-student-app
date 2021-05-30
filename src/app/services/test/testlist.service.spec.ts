import { TestBed } from '@angular/core/testing';

import { TestlistService } from './testlist.service';

describe('TestlistService', () => {
  let service: TestlistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestlistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
