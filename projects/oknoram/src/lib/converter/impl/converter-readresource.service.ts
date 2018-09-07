import { Inject, Injectable } from '@angular/core';
import { ReadResource } from '@knora/core';
import { PropertyDef } from '../../mapping/property-def';
import { ResourceMapping } from '../../mapping/resource-mapping';
import { OknoramConfig, OknoramConfigToken } from '../../oknoram-config';
import { ConverterService } from '../converter.service';

@Injectable({
  providedIn: 'root'
})
export class ConverterReadresourceService implements ConverterService {
  constructor(@Inject(OknoramConfigToken) private config: OknoramConfig) {}

  getAttFullName(rm: ResourceMapping, att: PropertyDef): string {
    // FIXME: really depends on JSONLD rules...
    return `${this.config.knoraApiBaseUrl}/ontology/${rm.def.projectCode}/${
      rm.def.projectShortname
    }/v2#${att.name}`;
  }

  convert<T>(rm: ResourceMapping, res: ReadResource): T {
    const obj = {};
    obj[rm.iri] = res.id;
    if (rm.label) {
      obj[rm.label] = res.label;
    }
    rm.attributes.forEach((att, key) => {
      const fullAttName = this.getAttFullName(rm, att);
      if (!(res.properties && fullAttName in res.properties) && !att.optional) {
        throw new Error(`Cannot find property ${fullAttName} in query result`);
      } else if (res.properties && fullAttName in res.properties) {
        obj[key] = res.properties[fullAttName][0].getContent();
      } else {
        obj[key] = null;
      }
    });
    return obj as T;
  }
}
