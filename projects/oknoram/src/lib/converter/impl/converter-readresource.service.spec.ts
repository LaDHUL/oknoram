import { inject, TestBed } from '@angular/core/testing';
import { KnoraResource } from '../../knora-api/knora-resource';
import { PropertyDef } from '../../mapping/property-def';
import { ResourceMapping } from '../../mapping/resource-mapping';
import { OknoramConfig, OknoramConfigToken } from '../../oknoram-config';
import { OknoramConfigStub } from '../../test/helpers';
import { ConverterReadresourceService } from './converter-readresource.service';

export class TestModel {
  iriVar: string;
  labelVar: string;
  strVar: string;
}

describe('ConverterReadresourceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ConverterReadresourceService,
          useClass: ConverterReadresourceService
        },
        {
          provide: OknoramConfigToken,
          useClass: OknoramConfigStub
        }
      ]
    });
  });

  it('should be created', inject(
    [ConverterReadresourceService],
    (service: ConverterReadresourceService) => {
      expect(service).toBeTruthy();
      expect(service instanceof ConverterReadresourceService).toBeTruthy();
    }
  ));

  it('should convert', inject(
    [ConverterReadresourceService, OknoramConfigToken],
    (service: ConverterReadresourceService, oknoramConfig: OknoramConfig) => {
      const propRef = {
        type: null,
        name: 'strOntoVar',
        optional: false
      } as PropertyDef;

      const rm = new ResourceMapping(TestModel);
      rm.iri = 'iriVar';
      rm.label = 'labelVar';
      rm.propertyMapping('strVar', propRef);

      const res = {
        id: 'iri',
        label: 'label',
        properties: new Map<string, any>().set('strOntoVar', 'value')
      } as KnoraResource;

      const converted = service.convert<TestModel>(rm, res);

      expect(converted).toBeTruthy();
      expect(converted.iriVar).toBe('iri');
      expect(converted.labelVar).toBe('label');
      expect(converted.strVar).toBe('value');
    }
  ));
});
