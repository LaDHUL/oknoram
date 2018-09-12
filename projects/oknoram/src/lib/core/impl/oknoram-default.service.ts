import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { concatAll, map, switchMap, toArray } from 'rxjs/operators';
import { ConverterService } from '../../converter/converter.service';
import { GravsearchService } from '../../gravsearch/gravsearch.service';
import { KnoraApiService } from '../../knora-api/knora-api.service';
import { OntologyMapping } from '../../mapping/ontology-mapping';
import { ResourceMapping } from '../../mapping/resource-mapping';
import { OknoramService } from '../oknoram.service';
import { Page } from '../page';
import { PageRequest } from '../page-request';

@Injectable({
  providedIn: 'root'
})
export class OknoramDefaultService implements OknoramService {
  constructor(
    private gravsearchService: GravsearchService,
    private knoraApiService: KnoraApiService,
    private converterService: ConverterService
  ) {}

  count(classTarget): Observable<number> {
    const rm = OntologyMapping.mapping().resourceMapping(classTarget);
    const query = this.gravsearchService.buildQuery(rm);
    return this.knoraApiService.countQuery(query);
  }

  findById<T>(classTarget, id: string): Observable<T> {
    const rm = OntologyMapping.mapping().resourceMapping(classTarget);
    const query = this.gravsearchService.buildQuery(rm, [id]);
    return this.getObjects<T>(query, rm, 0).pipe(
      switchMap((res: T[]) => {
        if (!res || res.length <= 0) {
          return of(null);
        } else if (res.length > 1) {
          return Observable.throw(
            new Error(
              `Found several resources (${
                res.length
              }) for the specified id: ${id}`
            )
          );
        } else {
          return of(res[0]);
        }
      })
    );
  }

  findAll<T>(classTarget, pageRequest?: PageRequest): Observable<Page<T>> {
    const rm = OntologyMapping.mapping().resourceMapping(classTarget);
    const query = this.gravsearchService.buildQuery(rm);

    if (!pageRequest) {
      return this.knoraApiService
        .countQuery(query)
        .pipe(
          switchMap(
            count =>
              count <= 0
                ? of(new Page<T>(0, 0, []))
                : this.getObjects<T>(query, rm, 0).pipe(
                    switchMap((res: T[]) => of(new Page<T>(0, count, res)))
                  )
          )
        );
    } else {
      return this.getObjects<T>(query, rm, pageRequest.pageIndex).pipe(
        switchMap((res: T[]) =>
          of(new Page<T>(pageRequest.pageIndex, pageRequest.totalCount, res))
        )
      );
    }
  }

  private getObjects<T>(
    query: string,
    rm: ResourceMapping,
    pageIndex: number
  ): Observable<T[]> {
    return this.knoraApiService.executeQuery(query, rm, pageIndex).pipe(
      concatAll(),
      map(res => this.converterService.convert<T>(rm, res)),
      toArray()
    );
  }
}
