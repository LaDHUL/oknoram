import { KnoraResource } from '../../knora-api/knora-resource';
import { PropertyDef } from '../../mapping/property-def';
import { ResourceMapping } from '../../mapping/resource-mapping';
import { ConverterService } from '../converter.service';
import { ConverterReadresourceService } from './converter-readresource.service';

export class TestModel {
  iriVar: string;
  labelVar: string;
  strVar: string;
}

describe('ConverterReadresourceService', () => {
  let convertService: ConverterService;
  beforeEach(() => {
    convertService = new ConverterReadresourceService();
  });

  it('should convert knora ', () => {
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

    const converted = convertService.convert<TestModel>(rm, res);

    expect(converted).toBeTruthy();
    expect(converted.iriVar).toBe('iri');
    expect(converted.labelVar).toBe('label');
    expect(converted.strVar).toBe('value');
  });
});
