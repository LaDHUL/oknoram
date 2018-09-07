import { inject, TestBed } from '@angular/core/testing';
import { ReadResource, ReadTextValueAsString } from '@knora/core';
import { PropertyDef } from 'oknoram/lib/mapping/property-def';
import { PropertyType } from '../../mapping/property-type';
import { ResourceMapping } from '../../mapping/resource-mapping';
import { OknoramConfig, OknoramConfigToken } from '../../oknoram-config';
import { ConverterReadresourceService } from './converter-readresource.service';

export class TestModel {
  iriValue: string;
  labelValue: string;
  strValue: string;
}

export class OknoramConfigStub implements OknoramConfig {
  knoraApiBaseUrl = 'knoraApiBaseUrl';
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

  it('OknoramConfig#knoraApiBaseUrl should return stubbed value from a spy', inject(
    [OknoramConfigToken],
    (oknoramConfig: OknoramConfig) => {
      expect(oknoramConfig).toBeTruthy();
      expect(oknoramConfig.knoraApiBaseUrl).toBe('knoraApiBaseUrl');
    }
  ));

  it('should convert', inject(
    [ConverterReadresourceService, OknoramConfigToken],
    (service: ConverterReadresourceService, oknoramConfig: OknoramConfig) => {
      const rm = new ResourceMapping(TestModel);
      rm.iri = 'iriValue';
      rm.label = 'labelValue';
      rm.propertyMapping('strValue', {
        type: PropertyType.TextValue,
        name: null,
        optional: false
      } as PropertyDef);

      spyOn(service, 'getAttFullName').and.returnValue('varName');

      const propValue = new ReadTextValueAsString(null, null, 'value');
      const res = {
        id: 'iri',
        label: 'label',
        properties: {
          varName: [propValue]
        },
        type: null,
        incomingRegions: null,
        incomingStillImageRepresentations: null,
        incomingLinks: null,
        stillImageRepresentationsToDisplay: null
      } as ReadResource;

      const converted = service.convert<TestModel>(rm, res);
      expect(converted).toBeTruthy();
      expect(converted.iriValue).toBe(res.id);
      expect(converted.labelValue).toBe(res.label);
      expect(converted.strValue).toBe(propValue.getContent());
    }
  ));
});
