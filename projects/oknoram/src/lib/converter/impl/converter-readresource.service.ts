import { Injectable } from '@angular/core';
import { KnoraResource } from '../../knora-api/knora-resource';
import { PropertyType } from '../../mapping/property-type';
import { ResourceMapping } from '../../mapping/resource-mapping';
import { ConverterService } from '../converter.service';

@Injectable({
  providedIn: 'root'
})
export class ConverterReadresourceService implements ConverterService {
  convert<T>(rm: ResourceMapping, res: KnoraResource): T {
    const obj = {};
    obj[rm.iri] = res.id;
    if (rm.label) {
      obj[rm.label] = res.label;
    }
    rm.attributes.forEach((att, key) => {
      let attName = att.name;
      if (att.type === PropertyType.LinkValue) {
        attName = attName + 'Value';
      }
      if (!att.optional && !res.properties.has(attName)) {
        throw new Error(`Cannot find property ${attName} in Knora resource`);
      } else if (res.properties.has(attName)) {
        obj[key] = res.properties.get(attName);
      } else {
        obj[key] = null;
      }
    });
    return obj as T;
  }
}
