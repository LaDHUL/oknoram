import { ReadBooleanValue, ReadTextValueAsString } from '@knora/core';
import { Iri, Label, Property, Resource } from './decorator-functions';
import { OntologyMapping } from './ontology-mapping';
import { PropertyType } from './property-type';

@Resource({
  name: 'Resource1',
  projectCode: '0001',
  projectShortname: 'test'
})
export class Class1 {
  @Iri
  theId: string;
  @Label
  theLabel: string;
  @Property({
    type: PropertyType.TextValue,
    name: 'ontoProp11',
    optional: true
  })
  attr11: ReadTextValueAsString[];
  @Property({ type: PropertyType.BooleanValue, name: 'ontoProp12' })
  attr12: ReadBooleanValue[];
}

@Resource({
  name: 'Resource2',
  projectCode: '0001',
  projectShortname: 'test',
  extend: Class1
})
export class Class2 extends Class1 {
  @Property({
    type: PropertyType.TextValue,
    name: 'ontoProp21'
  })
  attr21: ReadTextValueAsString[];
}

@Resource({
  name: 'Resource3',
  projectCode: '0001',
  projectShortname: 'test',
  extend: Class1
})
export class Class3 extends Class1 {
  @Iri
  theId3: string;
  @Label
  theLabel3: string;
  @Property({
    type: PropertyType.TextValue,
    name: 'ontoProp31'
  })
  attr31: ReadTextValueAsString[];
}

@Resource({
  name: 'Resource4',
  projectCode: '0001',
  projectShortname: 'test',
  extend: Class3
})
export class Class4 extends Class3 {
  @Label
  theLabel4: string;
  @Property({
    type: PropertyType.TextValue,
    name: 'ontoProp41'
  })
  attr41: ReadTextValueAsString[];
}

@Resource({
  name: 'ResourceEmpty',
  projectCode: '0001',
  projectShortname: 'test'
})
export class ClassEmpty {
  @Iri
  theId: string;
}

@Resource({
  name: 'ResourceNoIri',
  projectCode: '0001',
  projectShortname: 'test'
})
export class ClassNoIri {}

describe('OntologyMapping', () => {
  it('should get the correct mapping of ClassEmpty', () => {
    const mapping = OntologyMapping.mapping().resourceMapping(ClassEmpty);
    expect(mapping).toBeTruthy();
    expect(mapping.def).toBeTruthy();
    expect(mapping.def.name).toBe('ResourceEmpty');
    expect(mapping.def.projectCode).toBe('0001');
    expect(mapping.def.projectShortname).toBe('test');
    expect(mapping.def.extend).toBeUndefined();
    expect(mapping.iri).toBe('theId');
    expect(mapping.label).toBeUndefined();
    expect(mapping.attributes.size).toBe(0);
  });

  it('should throw error for mapping of ClassNoIri', () => {
    const mapping = OntologyMapping.mapping().resourceMapping(ClassNoIri);
    expect(mapping).toBeTruthy();
    expect(mapping.def).toBeTruthy();
    expect(mapping.def.name).toBe('ResourceNoIri');
    expect(mapping.def.projectCode).toBe('0001');
    expect(mapping.def.projectShortname).toBe('test');
    expect(mapping.def.extend).toBeUndefined();
    expect(mapping.label).toBeUndefined();
    expect(mapping.attributes.size).toBe(0);
    let throwEx = false;
    try {
      const iri = mapping.iri;
    } catch (e) {
      throwEx = true;
    }
    if (!throwEx) {
      fail();
    }
  });

  it('should get the correct mapping of Class1', () => {
    const mapping = OntologyMapping.mapping().resourceMapping(Class1);
    expect(mapping).toBeTruthy();
    expect(mapping.def).toBeTruthy();
    expect(mapping.def.name).toBe('Resource1');
    expect(mapping.def.projectCode).toBe('0001');
    expect(mapping.def.projectShortname).toBe('test');
    expect(mapping.def.extend).toBeUndefined();
    expect(mapping.iri).toBe('theId');
    expect(mapping.label).toBe('theLabel');
    expect(mapping.attributes.size).toBe(2);
    expect(mapping.attributes.has('attr11')).toBeTruthy();
    expect(mapping.attributes.get('attr11').name).toBe('ontoProp11');
    expect(mapping.attributes.get('attr11').optional).toBe(true);
    expect(mapping.attributes.get('attr11').type).toBe(PropertyType.TextValue);
    expect(mapping.attributes.has('attr12')).toBeTruthy();
    expect(mapping.attributes.get('attr12').name).toBe('ontoProp12');
    expect(mapping.attributes.get('attr12').optional).toBeUndefined();
    expect(mapping.attributes.get('attr12').type).toBe(
      PropertyType.BooleanValue
    );
  });

  it('should get the correct mapping of Class2', () => {
    const mapping = OntologyMapping.mapping().resourceMapping(Class2);
    expect(mapping).toBeTruthy();
    expect(mapping.def).toBeTruthy();
    expect(mapping.def.name).toBe('Resource2');
    expect(mapping.def.projectCode).toBe('0001');
    expect(mapping.def.projectShortname).toBe('test');
    expect(mapping.def.extend).toEqual(Class1);
    expect(mapping.iri).toBe('theId');
    expect(mapping.label).toBe('theLabel');
    expect(mapping.attributes.size).toBe(3);
    expect(mapping.attributes.has('attr11')).toBeTruthy();
    expect(mapping.attributes.get('attr11').name).toBe('ontoProp11');
    expect(mapping.attributes.get('attr11').optional).toBe(true);
    expect(mapping.attributes.get('attr11').type).toBe(PropertyType.TextValue);
    expect(mapping.attributes.has('attr12')).toBeTruthy();
    expect(mapping.attributes.get('attr12').name).toBe('ontoProp12');
    expect(mapping.attributes.get('attr12').optional).toBeUndefined();
    expect(mapping.attributes.get('attr12').type).toBe(
      PropertyType.BooleanValue
    );
    expect(mapping.attributes.has('attr21')).toBeTruthy();
    expect(mapping.attributes.get('attr21').name).toBe('ontoProp21');
    expect(mapping.attributes.get('attr21').optional).toBeUndefined();
    expect(mapping.attributes.get('attr21').type).toBe(PropertyType.TextValue);
  });

  it('should get the correct mapping of Class3', () => {
    const mapping = OntologyMapping.mapping().resourceMapping(Class3);
    expect(mapping).toBeTruthy();
    expect(mapping.def).toBeTruthy();
    expect(mapping.def.name).toBe('Resource3');
    expect(mapping.def.projectCode).toBe('0001');
    expect(mapping.def.projectShortname).toBe('test');
    expect(mapping.def.extend).toEqual(Class1);
    expect(mapping.iri).toBe('theId3');
    expect(mapping.label).toBe('theLabel3');
    expect(mapping.attributes.size).toBe(3);
    expect(mapping.attributes.has('attr11')).toBeTruthy();
    expect(mapping.attributes.get('attr11').name).toBe('ontoProp11');
    expect(mapping.attributes.get('attr11').optional).toBe(true);
    expect(mapping.attributes.get('attr11').type).toBe(PropertyType.TextValue);
    expect(mapping.attributes.has('attr12')).toBeTruthy();
    expect(mapping.attributes.get('attr12').name).toBe('ontoProp12');
    expect(mapping.attributes.get('attr12').optional).toBeUndefined();
    expect(mapping.attributes.get('attr12').type).toBe(
      PropertyType.BooleanValue
    );
    expect(mapping.attributes.has('attr31')).toBeTruthy();
    expect(mapping.attributes.get('attr31').name).toBe('ontoProp31');
    expect(mapping.attributes.get('attr31').optional).toBeUndefined();
    expect(mapping.attributes.get('attr31').type).toBe(PropertyType.TextValue);
  });

  it('should get the correct mapping of Class4', () => {
    const mapping = OntologyMapping.mapping().resourceMapping(Class4);
    expect(mapping).toBeTruthy();
    expect(mapping.def).toBeTruthy();
    expect(mapping.def.name).toBe('Resource4');
    expect(mapping.def.projectCode).toBe('0001');
    expect(mapping.def.projectShortname).toBe('test');
    expect(mapping.def.extend).toEqual(Class3);
    expect(mapping.iri).toBe('theId3');
    expect(mapping.label).toBe('theLabel4');
    expect(mapping.attributes.size).toBe(4);
    expect(mapping.attributes.has('attr11')).toBeTruthy();
    expect(mapping.attributes.get('attr11').name).toBe('ontoProp11');
    expect(mapping.attributes.get('attr11').optional).toBe(true);
    expect(mapping.attributes.get('attr11').type).toBe(PropertyType.TextValue);
    expect(mapping.attributes.has('attr12')).toBeTruthy();
    expect(mapping.attributes.get('attr12').name).toBe('ontoProp12');
    expect(mapping.attributes.get('attr12').optional).toBeUndefined();
    expect(mapping.attributes.get('attr12').type).toBe(
      PropertyType.BooleanValue
    );
    expect(mapping.attributes.has('attr31')).toBeTruthy();
    expect(mapping.attributes.get('attr31').name).toBe('ontoProp31');
    expect(mapping.attributes.get('attr31').optional).toBeUndefined();
    expect(mapping.attributes.get('attr31').type).toBe(PropertyType.TextValue);
    expect(mapping.attributes.has('attr41')).toBeTruthy();
    expect(mapping.attributes.get('attr41').name).toBe('ontoProp41');
    expect(mapping.attributes.get('attr41').optional).toBeUndefined();
    expect(mapping.attributes.get('attr41').type).toBe(PropertyType.TextValue);
  });
});
