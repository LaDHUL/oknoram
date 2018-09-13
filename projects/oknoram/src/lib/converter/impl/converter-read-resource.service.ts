import { Inject, Injectable } from '@angular/core';
import { ReadResource } from '@knora/core';
import { PropertyType } from '../../mapping/property-type';
import { ResourceMapping } from '../../mapping/resource-mapping';
import { OknoramConfig, OknoramConfigToken } from '../../oknoram-config';
import { ConverterService } from '../converter.service';

@Injectable({
  providedIn: 'root'
})
export class ConverterReadResourceService implements ConverterService {
  constructor(@Inject(OknoramConfigToken) private config: OknoramConfig) {}

  convert<T>(rm: ResourceMapping, res: ReadResource): T {
    const obj = {};
    obj[rm.iri] = res.id;
    if (rm.label) {
      obj[rm.label] = res.label;
    }
    rm.attributes.forEach((att, key) => {
      let attName = `${this.config.knoraApiBaseUrl}/ontology/${
        rm.def.projectCode
      }/${rm.def.projectShortname}/v2#${att.name}`;
      if (att.type === PropertyType.LinkValue) {
        attName = attName + 'Value';
      }
      if (!att.optional && res.properties && !(attName in res.properties)) {
        throw new Error(`Cannot find property ${attName} in Knora resource`);
      } else if (res.properties && attName in res.properties) {
        obj[key] = res.properties[attName];
      } else {
        obj[key] = null;
      }
    });
    return obj as T;
  }
}
