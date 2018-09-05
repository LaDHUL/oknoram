import { ResourceMapping } from './resource-mapping';

export class OntologyMapping {
  private static mapping_ = new OntologyMapping();
  private classes_ = new Map<Object, ResourceMapping>();

  private constructor() {}

  static mapping(): OntologyMapping {
    return OntologyMapping.mapping_;
  }

  resourceMapping(classTarget): ResourceMapping {
    if (!this.classes_.has(classTarget)) {
      this.classes_.set(classTarget, new ResourceMapping(classTarget));
    }
    return this.classes_.get(classTarget);
  }
}
