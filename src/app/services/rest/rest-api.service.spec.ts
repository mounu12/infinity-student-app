import { TestBed } from '@angular/core/testing';

import { RestApiService } from '@app-services/rest/rest-api.service';

describe('RestApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RestApiService = TestBed.get(RestApiService);
    expect(service).toBeTruthy();
  });
});
