import { TestBed } from '@angular/core/testing';
import { KnoraApiDefaultService } from './knora-api-default.service';

describe('KnoraApiDefaultService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KnoraApiDefaultService]
    });
  });

  // it('should be created', inject([KnoraApiDefaultService], (service: KnoraApiDefaultService) => {
  //   expect(service).toBeTruthy();
  // }));
});
