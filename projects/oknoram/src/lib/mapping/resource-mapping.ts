import { OntologyMapping } from './ontology-mapping';
import { PropertyDef } from './property-def';
import { ResourceDef } from './resource-def';

export class ResourceMapping {
  private def_: ResourceDef;
  private iriProperty_: string;
  private labelProperty_: string;
  private attributes_ = new Map<string, PropertyDef>();

  constructor(private classTarget_) {}

  classTarget() {
    return this.classTarget_;
  }

  set def(def: ResourceDef) {
    this.def_ = def;
  }

  get def() {
    return this.def_;
  }

  set iri(propertyKey: string) {
    this.iriProperty_ = propertyKey;
  }

  foundInheritedIri(classTarget) {
    const targetMapping = OntologyMapping.mapping().resourceMapping(
      classTarget
    );
    let iri = targetMapping.iri;
    if (!iri && targetMapping.def.extend) {
      iri = this.foundInheritedIri(targetMapping);
    }
    return iri;
  }

  get iri() {
    let iri = this.iriProperty_;
    if (!iri && this.def_.extend) {
      iri = this.foundInheritedIri(this.def_.extend);
    }
    if (!iri) {
      throw new Error(`Iri mapping of ${this.classTarget_} is missing`);
    }
    return iri;
  }

  set label(propertyKey: string) {
    this.labelProperty_ = propertyKey;
  }

  foundInheritedLabel(classTarget) {
    const targetMapping = OntologyMapping.mapping().resourceMapping(
      classTarget
    );
    let label = targetMapping.label;
    if (!label && targetMapping.def.extend) {
      label = this.foundInheritedLabel(targetMapping);
    }
    return label;
  }

  get label() {
    let label = this.labelProperty_;
    if (!label && this.def_.extend) {
      label = this.foundInheritedLabel(this.def_.extend);
    }
    return label;
  }

  foundInheritedAttributes(classTarget, attrs: Map<string, PropertyDef>) {
    const targetMapping = OntologyMapping.mapping().resourceMapping(
      classTarget
    );
    if (targetMapping.def.extend) {
      return this.foundInheritedAttributes(targetMapping.def.extend, attrs);
    }
    OntologyMapping.mapping()
      .resourceMapping(this.def_.extend)
      .attributes.forEach((value, key) => attrs.set(key, value));
  }

  get attributes() {
    const attrs = new Map<string, PropertyDef>();
    if (this.def_.extend) {
      this.foundInheritedAttributes(this.def_.extend, attrs);
    }
    this.attributes_.forEach((value, key) => attrs.set(key, value));
    return attrs;
  }

  propertyMapping(propertyKey: string, propertyDef: PropertyDef) {
    if (this.attributes_.has(propertyKey)) {
      throw new Error(
        `Property mapping of ${this.classTarget_}/${propertyKey} already exists`
      );
    }
    this.attributes_.set(propertyKey, propertyDef);
  }
}
