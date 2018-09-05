import { ReadResource } from '@knora/core';
import { ResourceMapping } from '../mapping/resource-mapping';

export abstract class ConverterService {
  abstract convert<T>(rm: ResourceMapping, res: ReadResource): T;
}
