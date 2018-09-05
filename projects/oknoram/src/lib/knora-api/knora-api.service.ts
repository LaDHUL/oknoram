import { ReadResource } from '@knora/core';
import { Observable } from 'rxjs';

export abstract class KnoraApiService {
  abstract executeQuery(query: string): Observable<ReadResource[]>;
  abstract countQuery(query: string): Observable<number>;
}
