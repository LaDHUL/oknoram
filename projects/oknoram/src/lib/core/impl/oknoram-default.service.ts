import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { concatAll, map, toArray } from 'rxjs/operators';
import { ConverterService } from '../../converter/converter.service';
import { GravsearchService } from '../../gravsearch/gravsearch.service';
import { KnoraApiService } from '../../knora-api/knora-api.service';
import { OntologyMapping } from '../../mapping/ontology-mapping';
import { OknoramService } from '../oknoram.service';

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

  findAll<T>(classTarget): Observable<T[]> {
    const rm = OntologyMapping.mapping().resourceMapping(classTarget);
    const query = this.gravsearchService.buildQuery(rm);
    return this.knoraApiService.executeQuery(query).pipe(
      concatAll(),
      map(res => this.converterService.convert<T>(rm, res)),
      toArray()
    );
  }
}
