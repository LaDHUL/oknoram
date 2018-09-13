import {
  makeReadResource,
  makeResourceMapping,
  OknoramConfigStub,
  TestModel
} from '../../test/helpers';
import { ConverterService } from '../converter.service';
import { ConverterReadResourceService } from './converter-read-resource.service';

describe('ConverterReadResourceService', () => {
  let convertService: ConverterService;
  beforeEach(() => {
    convertService = new ConverterReadResourceService(new OknoramConfigStub());
  });

  it('should convert knora resource into model object', () => {
    const converted = convertService.convert<TestModel>(
      makeResourceMapping(),
      makeReadResource()
    );
    expect(converted).toBeTruthy();
    expect(converted.iriVar).toBe('iri');
    expect(converted.labelVar).toBe('label');
    expect(converted.strVar).toBeTruthy();
    expect(converted.strVar.length).toBe(1);
    expect(converted.strVar[0].str).toBe('value');
  });
});
