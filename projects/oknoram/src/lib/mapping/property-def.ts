import { PropertyType } from './property-type';

export interface PropertyDef {
  type: PropertyType;
  name: string;
  optional?: boolean;
}
