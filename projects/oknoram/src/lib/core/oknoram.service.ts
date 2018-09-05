import { Observable } from 'rxjs';

export abstract class OknoramService {
  abstract findAll<T>(classTarget): Observable<T[]>;
  abstract count(classTarget): Observable<number>;
}
