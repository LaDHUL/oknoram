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

  get iri() {
    const iri = this.iriProperty_;
    if (!iri) {
      throw new Error(`Iri mapping of ${this.classTarget_} is missing`);
    }
    return iri;
  }

  set label(propertyKey: string) {
    this.labelProperty_ = propertyKey;
  }

  get label() {
    return this.labelProperty_;
  }

  get attributes() {
    const attrs = new Map<string, PropertyDef>();
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
