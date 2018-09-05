import { OntologyMapping } from './ontology-mapping';
import { PropertyDef } from './property-def';
import { ResourceDef } from './resource-def';

export function Label(classTarget: object, propertyKey: string) {
  OntologyMapping.mapping().resourceMapping(
    classTarget.constructor
  ).label = propertyKey;
}

export function Iri(classTarget: object, propertyKey: string) {
  OntologyMapping.mapping().resourceMapping(
    classTarget.constructor
  ).iri = propertyKey;
}

export function Property(attributes: PropertyDef) {
  return (classTarget: object, propertyKey: string) => {
    OntologyMapping.mapping()
      .resourceMapping(classTarget.constructor)
      .propertyMapping(propertyKey, attributes);
  };
}

export function Resource(attributes: ResourceDef) {
  return (classTarget: object) => {
    OntologyMapping.mapping().resourceMapping(classTarget).def = attributes;
  };
}
