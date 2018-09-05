import { Inject, Injectable } from '@angular/core';
import { ReadResource } from '@knora/core';
import { OknoramConfig } from 'oknoram/oknoram';
import { ResourceMapping } from '../../mapping/resource-mapping';
import { OknoramConfigToken } from '../../oknoram-config';
import { ConverterService } from '../converter.service';

@Injectable({
  providedIn: 'root'
})
export class ConverterReadresourceService implements ConverterService {
  constructor(@Inject(OknoramConfigToken) private config: OknoramConfig) {}

  convert<T>(rm: ResourceMapping, res: ReadResource): T {
    console.log(res);

    const obj = {};
    obj[rm.iri] = res.id;
    if (rm.label) {
      obj[rm.label] = res.label;
    }
    rm.attributes.forEach((att, key) => {
      const fullAttName = `${this.config.knoraApiBaseUrl}/ontology/${
        this.config.projectCode
      }/${this.config.projectShortname}/v2#${att.name}`;
      if (!(fullAttName in res.properties) && !att.optional) {
        throw new Error(`Cannot find property ${fullAttName} in query result`);
      } else if (fullAttName in res.properties) {
        obj[key] = res.properties[fullAttName][0].getContent();
      } else {
        obj[key] = null;
      }
    });
    return obj as T;
  }
}
