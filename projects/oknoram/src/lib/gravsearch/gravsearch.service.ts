import { ResourceMapping } from '../mapping/resource-mapping';

export abstract class GravsearchService {
  abstract buildQuery(rm: ResourceMapping): string;
}
