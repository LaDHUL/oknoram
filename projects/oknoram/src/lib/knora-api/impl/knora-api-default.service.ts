import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ConvertJSONLD, ReadResource } from '@knora/core';
import { from, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { OknoramConfig, OknoramConfigToken } from '../../oknoram-config';
import { KnoraApiService } from '../knora-api.service';

declare let require: any;
const jsonld = require('jsonld');

@Injectable({
  providedIn: 'root'
})
export class KnoraApiDefaultService implements KnoraApiService {
  constructor(
    @Inject(OknoramConfigToken) private config: OknoramConfig,
    private http: HttpClient
  ) {}

  countQuery(query: string): Observable<number> {
    return this.http
      .post(this.config.knoraApiBaseUrl + '/v2/searchextended/count', query)
      .pipe(map(json => +json['schema:numberOfItems']));
  }

  executeQuery(query: string): Observable<ReadResource[]> {
    return this.http
      .post(this.config.knoraApiBaseUrl + '/v2/searchextended', query)
      .pipe(
        mergeMap(jsonldReturned =>
          from(
            jsonld.promises
              .compact(jsonldReturned, {})
              .then(
                compacted =>
                  ConvertJSONLD.createReadResourcesSequenceFromJsonLD(compacted)
                    .resources
              )
          )
        )
      );
  }
}
