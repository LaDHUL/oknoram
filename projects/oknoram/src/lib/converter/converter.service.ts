import { KnoraResource } from '../knora-api/knora-resource';
import { ResourceMapping } from '../mapping/resource-mapping';

export abstract class ConverterService {
  abstract convert<T>(rm: ResourceMapping, res: KnoraResource): T;
}
