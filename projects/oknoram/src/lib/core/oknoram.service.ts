import { Observable } from 'rxjs';
import { Page } from './page';
import { PageRequest } from './page-request';

export abstract class OknoramService {
  abstract findAll<T>(
    classTarget,
    pageRequest?: PageRequest
  ): Observable<Page<T>>;

  abstract count(classTarget): Observable<number>;
}
