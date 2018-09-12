import {
  KnoraConstants,
  ReadResource,
  ReadTextValueAsString
} from '@knora/core';
import { PropertyDef } from '../mapping/property-def';
import { PropertyType } from '../mapping/property-type';
import { ResourceDef } from '../mapping/resource-def';
import { ResourceMapping } from '../mapping/resource-mapping';
import { OknoramConfig } from '../oknoram-config';

export class OknoramConfigStub implements OknoramConfig {
  knoraApiBaseUrl = 'knoraApiBaseUrl';
}

export class TestModel {
  iriVar: string;
  labelVar: string;
  strVar: ReadTextValueAsString;
}

export function makeResourceMapping(): ResourceMapping {
  const propRef = {
    type: PropertyType.TextValue,
    name: 'strOntoVar',
    optional: false
  } as PropertyDef;

  const rm = new ResourceMapping(TestModel);
  rm.iri = 'iriVar';
  rm.label = 'labelVar';
  rm.def = {
    name: 'resourceName',
    projectCode: 'projectCode',
    projectShortname: 'projectShortname'
  } as ResourceDef;
  rm.propertyMapping('strVar', propRef);
  return rm;
}

export function makeReadResource(): ReadResource {
  return {
    id: 'iri',
    type: KnoraConstants.ReadTextValueAsString,
    label: 'label',
    incomingRegions: null,
    incomingStillImageRepresentations: null,
    stillImageRepresentationsToDisplay: null,
    incomingLinks: null,
    properties: {
      'knoraApiBaseUrl/ontology/projectCode/projectShortname/v2#strOntoVar': [
        new ReadTextValueAsString(null, null, 'value')
      ]
    }
  } as ReadResource;
}
