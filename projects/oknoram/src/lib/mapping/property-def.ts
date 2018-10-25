import { PropertyCardinality } from './property-cardinality';
import { PropertyType } from './property-type';

export interface PropertyDef {
  type: PropertyType;
  name: string;
  cardinality?: PropertyCardinality;
  optional?: boolean;
}
