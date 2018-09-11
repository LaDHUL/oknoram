import { of } from 'rxjs';
import { ConverterService } from '../../converter/converter.service';
import { GravsearchService } from '../../gravsearch/gravsearch.service';
import { TestModel } from '../../knora-api/impl/knora-api-default.service.spec';
import { KnoraApiService } from '../../knora-api/knora-api.service';
import { OknoramDefaultService } from './oknoram-default.service';

describe('OknoramDefaultService', () => {
  let gravsearchServiceSpy: jasmine.SpyObj<GravsearchService>;
  let knoraApiServiceSpy: jasmine.SpyObj<KnoraApiService>;
  let converterServiceSpy: jasmine.SpyObj<ConverterService>;
  let oknoramService: OknoramDefaultService;

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

  it('should return first page with a TestModel resource', () => {
    const tm = {
      iriVar: 'iriVar',
      labelVar: 'labelVar',
      strVar: 'strVar'
    } as TestModel;
    knoraApiServiceSpy.countQuery.and.returnValue(of(2));
    knoraApiServiceSpy.executeQuery.and.returnValue(of([{}, {}]));
    converterServiceSpy.convert.and.returnValue(tm);
    oknoramService.findAll<TestModel>(TestModel).subscribe(page => {
      expect(page.totalCount).toBe(2);
      expect(page.pageIndex).toBe(0);
      expect(page.pageSize).toBe(2);
      expect(page.content.length).toBe(2);
      expect(page.content).toEqual([tm, tm]);

      knoraApiServiceSpy.executeQuery.and.returnValue(of([{}]));
      oknoramService
        .findAll<TestModel>(TestModel, page.pageRequest(1))
        .subscribe(nextPage => {
          expect(nextPage.totalCount).toBe(2);
          expect(nextPage.pageIndex).toBe(1);
          expect(nextPage.pageSize).toBe(2);
          expect(nextPage.content.length).toBe(1);
          expect(nextPage.content).toEqual([tm]);
        }, fail);
    }, fail);

    expect(knoraApiServiceSpy.countQuery.calls.count()).toBe(1);
    expect(knoraApiServiceSpy.executeQuery.calls.count()).toBe(2);
    expect(converterServiceSpy.convert.calls.count()).toBe(3);
  });
});
