import { GVClass } from './gvclass';
import { GVFilter } from './gvfilter';
import { ONTO_PREFIX } from './gvquery-builder';

export class GVVar {
  optional_: boolean;
  incoming_: boolean;
  class_: GVClass;
  classesDest_: GVClass[];
  filter_: GVFilter;
  id_: string;
  prefix_ = ONTO_PREFIX;
  output_ = true;

  constructor(private name_: string, private type_: string) {}

  get name() {
    return this.name_;
  }

  get subject() {
    return this.name_ + (this.incoming_ ? '_incoming' : '');
  }

  get predicate() {
    return this.prefix_ + ':' + this.name_;
  }

  get type() {
    return this.type_;
  }

  prefix(prefix: string) {
    this.prefix_ = prefix;
    return this;
  }

  output(output: boolean) {
    this.output_ = output;
    return this;
  }

  optional(optional: boolean) {
    this.optional_ = optional;
    return this;
  }

  incoming(incoming: boolean) {
    this.incoming_ = incoming;
    return this;
  }

  class(class_: GVClass) {
    this.class_ = class_;
    return this;
  }

  classesDest(classesDest: GVClass[]) {
    this.classesDest_ = classesDest;
    return this;
  }

  filter(filter: GVFilter) {
    this.filter_ = filter;
    return this;
  }

  id(id: string) {
    this.id_ = id;
    return this;
  }
}
