import {
  makeKnoraResource,
  makeResourceMapping,
  TestModel
} from '../../test/helpers';
import { ConverterService } from '../converter.service';
import { ConverterReadresourceService } from './converter-readresource.service';

describe('ConverterReadresourceService', () => {
  let convertService: ConverterService;
  beforeEach(() => {
    convertService = new ConverterReadresourceService();
  });

  it('should convert knora ', () => {
    const converted = convertService.convert<TestModel>(
      makeResourceMapping(),
      makeKnoraResource()
    );

    expect(converted).toBeTruthy();
    expect(converted.iriVar).toBe('iri');
    expect(converted.labelVar).toBe('label');
    expect(converted.strVar).toBe('value');
  });
});
