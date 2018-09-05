import { TestBed, inject } from '@angular/core/testing';

import { ConverterReadresourceService } from './converter-readresource.service';

describe('ConverterReadresourceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConverterReadresourceService]
    });
  });

  it('should be created', inject([ConverterReadresourceService], (service: ConverterReadresourceService) => {
    expect(service).toBeTruthy();
  }));
});
