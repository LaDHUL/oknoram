import { inject, TestBed } from '@angular/core/testing';
import { GravsearchGvqueryService } from './gravsearch-gvquery.service';

describe('GravsearchGvqueryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GravsearchGvqueryService]
    });
  });

  it('should be created', inject(
    [GravsearchGvqueryService],
    (service: GravsearchGvqueryService) => {
      expect(service).toBeTruthy();
    }
  ));
});
