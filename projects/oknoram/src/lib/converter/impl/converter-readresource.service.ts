import { Injectable } from '@angular/core';
import { KnoraResource } from '../../knora-api/knora-resource';
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
      if (!att.optional && !res.properties.has(att.name)) {
        throw new Error(`Cannot find property ${att.name} in Knora resource`);
      } else if (res.properties.has(att.name)) {
        obj[key] = res.properties.get(att.name);
      } else {
        obj[key] = null;
      }
    });
    return obj as T;
  }
}
