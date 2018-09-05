import { ONTO_PREFIX } from './gvquery-builder';

export class GVClass {
  prefix_ = ONTO_PREFIX;
  constructor(private name_: string) {}

  prefix(prefix: string) {
    this.prefix_ = prefix;
    return this;
  }

  get subject() {
    return this.name_;
  }

  get predicate() {
    return this.prefix_ + ':' + this.name_;
  }
}

export class GVSrcClass extends GVClass {
  classesExcludes_: GVClass[];
  ids_: string[];
  classesExcludes(classesExcludes_: GVClass[]) {
    this.classesExcludes_ = classesExcludes_;
    return this;
  }
  ids(ids: string[]) {
    this.ids_ = ids;
    return this;
  }
}
