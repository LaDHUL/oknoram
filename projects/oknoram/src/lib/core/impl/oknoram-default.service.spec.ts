import { of } from 'rxjs';
import { ConverterService } from '../../converter/converter.service';
import { GravsearchService } from '../../gravsearch/gravsearch.service';
import { KnoraApiService } from '../../knora-api/knora-api.service';
import { TestModel, TestModelData } from '../../test/helpers';
import { OknoramService } from '../oknoram.service';
import { OknoramDefaultService } from './oknoram-default.service';

describe('OknoramDefaultService', () => {
  let gravsearchServiceSpy: jasmine.SpyObj<GravsearchService>;
  let knoraApiServiceSpy: jasmine.SpyObj<KnoraApiService>;
  let converterServiceSpy: jasmine.SpyObj<ConverterService>;
  let oknoramService: OknoramService;

  beforeEach(() => {
    gravsearchServiceSpy = jasmine.createSpyObj('GravsearchService', [
      'buildQuery'
    ]);
    knoraApiServiceSpy = jasmine.createSpyObj('KnoraApiService', [
      'countQuery',
      'executeQuery'
    ]);
    converterServiceSpy = jasmine.createSpyObj('ConverterService', ['convert']);
    oknoramService = new OknoramDefaultService(
      gravsearchServiceSpy,
      knoraApiServiceSpy,
      converterServiceSpy
    );
  });

  it('should count TestModel resources correctly', () => {
    knoraApiServiceSpy.countQuery.and.returnValue(of(5));
    oknoramService
      .count(TestModel)
      .subscribe(count => expect(count).toBe(5), fail);
    expect(knoraApiServiceSpy.countQuery.calls.count()).toBe(1);
  });

  it('should return an empty page', () => {
    knoraApiServiceSpy.countQuery.and.returnValue(of(0));
    oknoramService.findAll<TestModel>(TestModel).subscribe(page => {
      expect(page.totalCount).toBe(0);
      expect(page.pageIndex).toBe(0);
      expect(page.content.length).toBe(0);
      expect(page.content).toEqual([]);
    }, fail);

    expect(knoraApiServiceSpy.countQuery.calls.count()).toBe(1);
    expect(knoraApiServiceSpy.executeQuery.calls.count()).toBe(0);
    expect(converterServiceSpy.convert.calls.count()).toBe(0);
  });

  it('should return first page with a TestModel resource', () => {
    knoraApiServiceSpy.countQuery.and.returnValue(of(3));
    knoraApiServiceSpy.executeQuery.and.returnValue(of([{}, {}]));
    converterServiceSpy.convert.and.returnValue(TestModelData);
    oknoramService.findAll<TestModel>(TestModel).subscribe(page => {
      expect(page.totalCount).toBe(3);
      expect(page.pageIndex).toBe(0);
      expect(page.content.length).toBe(2);
      expect(page.content[0].iriVar).toEqual('iriVarValue');
      expect(page.content[0].labelVar).toEqual('labelVarValue');
      expect(page.content[0].strVar.length).toBe(1);
      expect(page.content[0].strVar[0]).toEqual('strVarValue');
      expect(page.content[1].iriVar).toEqual('iriVarValue');
      expect(page.content[1].labelVar).toEqual('labelVarValue');
      expect(page.content[1].strVar.length).toBe(1);
      expect(page.content[1].strVar[0]).toEqual('strVarValue');

      knoraApiServiceSpy.executeQuery.and.returnValue(of([{}]));
      oknoramService
        .findAll<TestModel>(TestModel, page.pageRequest(1))
        .subscribe(nextPage => {
          expect(nextPage.totalCount).toBe(3);
          expect(nextPage.pageIndex).toBe(1);
          expect(nextPage.content.length).toBe(1);
          expect(nextPage.content[0].iriVar).toEqual('iriVarValue');
          expect(nextPage.content[0].labelVar).toEqual('labelVarValue');
          expect(nextPage.content[0].strVar.length).toBe(1);
          expect(nextPage.content[0].strVar[0]).toEqual('strVarValue');
        }, fail);
    }, fail);

    expect(knoraApiServiceSpy.countQuery.calls.count()).toBe(1);
    expect(knoraApiServiceSpy.executeQuery.calls.count()).toBe(2);
    expect(converterServiceSpy.convert.calls.count()).toBe(3);
  });

  it('should return TestModel resource of specified id', () => {
    knoraApiServiceSpy.executeQuery.and.returnValue(of([{}]));
    converterServiceSpy.convert.and.returnValue(TestModelData);
    oknoramService.findById<TestModel>(TestModel, 'id').subscribe(obj => {
      expect(obj).toBeTruthy();
      expect(obj.iriVar).toEqual('iriVarValue');
      expect(obj.labelVar).toEqual('labelVarValue');
      expect(obj.strVar.length).toBe(1);
      expect(obj.strVar[0]).toEqual('strVarValue');
    }, fail);
    expect(knoraApiServiceSpy.executeQuery.calls.count()).toBe(1);
    expect(converterServiceSpy.convert.calls.count()).toBe(1);
  });

  it('should throw exception of several resources of specified id', () => {
    knoraApiServiceSpy.executeQuery.and.returnValue(of([{}, {}]));
    converterServiceSpy.convert.and.returnValue(TestModelData);
    oknoramService
      .findById<TestModel>(TestModel, 'id')
      .subscribe(obj => {}, error => expect(error).toBeTruthy());
    expect(knoraApiServiceSpy.executeQuery.calls.count()).toBe(1);
    expect(converterServiceSpy.convert.calls.count()).toBe(2);
  });

  it('should return null of unknown id', () => {
    knoraApiServiceSpy.executeQuery.and.returnValue(of([]));
    oknoramService.findById<TestModel>(TestModel, 'id').subscribe(obj => {
      expect(obj).toBeNull();
    }, fail);
    expect(knoraApiServiceSpy.executeQuery.calls.count()).toBe(1);
    expect(converterServiceSpy.convert.calls.count()).toBe(0);
  });
});
