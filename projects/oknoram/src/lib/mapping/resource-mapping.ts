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

  private breadthFirstSearchInherited(classTargets: any[], attName: string) {
    let nextClassTargets = [];
    for (const classTarget of classTargets) {
      const targetMapping = OntologyMapping.mapping().resourceMapping(
        classTarget
      );
      const attValue = attName in targetMapping ? targetMapping[attName] : null;
      if (attValue) {
        return attValue;
      }
      if (targetMapping.def.extends) {
        nextClassTargets = nextClassTargets.concat(targetMapping.def.extends);
      }
    }
    if (nextClassTargets.length > 0) {
      return this.breadthFirstSearchInherited(nextClassTargets, attName);
    }
    return null;
  }

  get iri() {
    let iri = this.iriProperty_;
    if (!iri && this.def_.extends) {
      // iri = this.foundFirstInheritedIri(this.def_.extends);
      iri = this.breadthFirstSearchInherited(this.def_.extends, 'iri');
    }
    if (!iri) {
      throw new Error(`Iri mapping of ${this.classTarget_} is missing`);
    }
    return iri;
  }

  set label(propertyKey: string) {
    this.labelProperty_ = propertyKey;
  }

  get label() {
    let label = this.labelProperty_;
    if (!label && this.def_.extends) {
      // label = this.foundFirstInheritedLabel(this.def_.extends);
      label = this.breadthFirstSearchInherited(this.def_.extends, 'label');
    }
    return label;
  }

  depthFirstSearchInheritedAttributes(
    classTargets: any[],
    attrs: Map<string, PropertyDef>
  ) {
    for (const classTarget of classTargets) {
      const targetMapping = OntologyMapping.mapping().resourceMapping(
        classTarget
      );
      if (targetMapping.def.extends) {
        this.depthFirstSearchInheritedAttributes(
          targetMapping.def.extends,
          attrs
        );
      }
      OntologyMapping.mapping()
        .resourceMapping(classTarget)
        .attributes.forEach((value, key) => attrs.set(key, value));
    }
  }

  get attributes() {
    const attrs = new Map<string, PropertyDef>();
    if (this.def_.extends) {
      this.depthFirstSearchInheritedAttributes(this.def_.extends, attrs);
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
