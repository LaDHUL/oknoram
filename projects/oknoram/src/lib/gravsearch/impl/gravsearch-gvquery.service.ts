import { Inject, Injectable } from '@angular/core';
import { PropertyDef } from '../../mapping/property-def';
import { PropertyType } from '../../mapping/property-type';
import { ResourceMapping } from '../../mapping/resource-mapping';
import { OknoramConfig, OknoramConfigToken } from '../../oknoram-config';
import { GravsearchService } from '../gravsearch.service';
import { GVSrcClass } from './gvclass';
import { GVQueryBuilder } from './gvquery-builder';
import { GVVar } from './gvvar';

export const TypeMapping = new Map<PropertyType, string>([
  [PropertyType.TextValue, 'xsd:string'],
  [PropertyType.BooleanValue, 'xsd:boolean'],
  [PropertyType.IntValue, 'xsd:integer'],
  [PropertyType.DecimalValue, 'xsd:decimal']
]);

@Injectable({
  providedIn: 'root'
})
export class GravsearchGvqueryService implements GravsearchService {
  constructor(@Inject(OknoramConfigToken) private config: OknoramConfig) {}

  buildQuery(rm: ResourceMapping, ids?: string[]): string {
    const qBuilder = new GVQueryBuilder(
      this.config.knoraApiBaseUrl,
      rm.def.projectCode,
      rm.def.projectShortname,
      new GVSrcClass(rm.def.name).ids(ids)
    );
    this.addVars(rm.attributes, qBuilder);
    return qBuilder.query();
  }

  private addVars(
    attributes: Map<string, PropertyDef>,
    qBuilder: GVQueryBuilder
  ) {
    attributes.forEach((att, key) => {
      const type = TypeMapping.get(att.type);
      const var_ = new GVVar(att.name, type).optional(att.optional);
      qBuilder.var(var_);
    });
  }
}
