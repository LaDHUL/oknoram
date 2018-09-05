import { TestBed, inject } from '@angular/core/testing';

import { OknoramDefaultService } from './oknoram-default.service';

describe('OknoramDefaultService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OknoramDefaultService]
    });
  });

  it('should be created', inject([OknoramDefaultService], (service: OknoramDefaultService) => {
    expect(service).toBeTruthy();
  }));
});
