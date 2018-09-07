import { Observable } from 'rxjs';
import { KnoraResource } from './knora-resource';

export abstract class KnoraApiService {
  abstract executeQuery(
    query: string,
    pageIndex?: number
  ): Observable<KnoraResource[]>;
  abstract countQuery(query: string): Observable<number>;
}
