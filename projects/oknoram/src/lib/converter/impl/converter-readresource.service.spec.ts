import { TestBed } from '@angular/core/testing';
import { OknoramConfig, OknoramConfigToken } from '../../oknoram-config';
import { ConverterReadresourceService } from './converter-readresource.service';

describe('ConverterReadresourceService', () => {
  let oknoramConfigSpy: jasmine.SpyObj<OknoramConfig>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConverterReadresourceService,
        {
          provide: OknoramConfigToken,
          useValue: jasmine.createSpyObj('OknoramConfigToken', [
            'knoraApiBaseUrl'
          ])
        }
      ]
    });
    oknoramConfigSpy = TestBed.get(OknoramConfigToken);
  });

  // it('should be created', inject(
  //   [ConverterReadresourceService],
  //   (service: ConverterReadresourceService) => {
  //     expect(service).toBeTruthy();
  //   }
  // ));

  // it('#knoraApiBaseUrl should return stubbed value from a spy', () => {
  //   const stubValue = 'stub value';
  //   oknoramConfigSpy.knoraApiBaseUrl.and.returnValue(stubValue);

  //   // expect(masterService.getValue())
  //   //   .toBe(stubValue, 'service returned stub value');
  //   expect(oknoramConfigSpy.knoraApiBaseUrl.calls.count()).toBe(
  //     1,
  //     'spy method was called once'
  //   );
  //   expect(
  //     oknoramConfigSpy.knoraApiBaseUrl.calls.mostRecent().returnValue
  //   ).toBe(stubValue);
  // });
});
