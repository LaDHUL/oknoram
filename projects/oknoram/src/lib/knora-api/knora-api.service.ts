import { Observable } from 'rxjs';
import { ResourceMapping } from '../mapping/resource-mapping';
import { KnoraResource } from './knora-resource';

export abstract class KnoraApiService {
  abstract executeQuery(
    query: string,
    rm: ResourceMapping,
    pageIndex?: number
  ): Observable<KnoraResource[]>;
  abstract countQuery(query: string): Observable<number>;
}
