import { HttpClient } from '@angular/common/http';
import { ReadResource, ReadTextValueAsString } from '@knora/core';
import { of } from 'rxjs';
import { OknoramConfigStub } from '../../test/helpers';
import { KnoraApiDefaultService } from './knora-api-default.service';

export class TestModel {
  iriVar: string;
  labelVar: string;
  strVar: string;
}

describe('KnoraApiDefaultService', () => {
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let knoraApiService: KnoraApiDefaultService;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    knoraApiService = new KnoraApiDefaultService(new OknoramConfigStub(), <any>(
      httpClientSpy
    ));
  });

  it('should return expected count', () => {
    spyOn<any>(knoraApiService, 'json2Count').and.returnValue(5);
    httpClientSpy.post.and.returnValue(of({}));
    knoraApiService
      .countQuery('query')
      .subscribe(count => expect(count).toBe(5), fail);
    expect(httpClientSpy.post.calls.count()).toBe(1);
  });

  it('should return expected resource', () => {
    spyOn<any>(knoraApiService, 'json2ReadResources').and.returnValue(
      of([
        {
          id: 'id',
          type: null,
          label: 'label',
          incomingRegions: null,
          incomingStillImageRepresentations: null,
          incomingLinks: null,
          stillImageRepresentationsToDisplay: null,
          properties: {
            propStr: [new ReadTextValueAsString(null, null, 'propStrValue')]
          }
        } as ReadResource
      ])
    );
    httpClientSpy.post.and.returnValue(of({}));
    knoraApiService.executeQuery('query', null).subscribe(res => {
      expect(res[0].id).toBe('id');
      expect(res[0].label).toBe('label');
      expect(res[0].properties['propStr']).toBeTruthy();
      expect(res[0].properties['propStr'][0]).toEqual(
        jasmine.any(ReadTextValueAsString)
      );
      expect((<ReadTextValueAsString>res[0].properties['propStr'][0]).str).toBe(
        'propStrValue'
      );
    }, fail);
    expect(httpClientSpy.post.calls.count()).toBe(1);
  });
});
