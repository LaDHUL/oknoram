import { GVSrcClass } from './gvclass';
import { GVVar } from './gvvar';

export const ONTO_PREFIX = 'onto';

export class GVQueryBuilder {
  private vars_: GVVar[] = [];
  private unionVars_: GVVar[];
  private unions_ = new Array<GVVar[]>();
  private orderByVar_: GVVar;
  private orderAscending_ = true;

  constructor(
    private knoraApiBaseUrl: string,
    private projectCode: string,
    private projectShortname: string,
    private srcClass_: GVSrcClass
  ) {}

  private varLine(v: GVVar, idGen = false) {
    // FIXME: should use excludes ?
    const src = `${v.class_ ? v.class_.subject : this.srcClass_.subject}`;
    const dest = `${v.subject}`;
    return v.incoming_
      ? `?${dest} ${v.predicate} ?${src} .` +
          (idGen && v.id_ ? `\n?${dest} ${v.predicate} <${v.id_}> .` : '')
      : `?${src} ${v.predicate} ?${dest} .` +
          (idGen && v.id_ ? `\n?${src} ${v.predicate} <${v.id_}> .` : '');
  }

  private construct(vars: GVVar[]): string {
    if (vars.length <= 0) {
      return '';
    }
    return vars
      .filter(v => v.output_)
      .map(v => this.varLine(v))
      .join('\n');
  }

  private properties(vars: GVVar[], union = false): string {
    if (vars.length <= 0) {
      return '';
    }
    return (
      (union ? '{\n' : '') +
      vars
        .map(
          v =>
            (union ? '{\n' : '') +
            (v.optional_ ? 'OPTIONAL {\n' : '') +
            `
${this.varLine(v, true)}
${v.predicate} knora-api:objectType ${v.type} .
${this.varAType(v)} .
` +
            (v.classesDest_
              ? v.classesDest_
                  .map(c => `{ ${this.sAo(v.subject, c.predicate)} . }`)
                  .join('\nUNION ')
              : '') +
            this.varFilter(v) +
            (v.optional_ ? '\n}' : '') +
            (union ? '\n}' : '')
        )
        .join('\n' + (union ? ' UNION\n' : '')) +
      (union ? '\n}' : '')
    );
  }

  private varFilter(v: GVVar) {
    if (!v.filter_) {
      return '';
    }
    if (v.filter_.operator === 'match') {
      return `FILTER knora-api:match(?${v.subject}, "${v.filter_.values[0]}")`;
    } else {
      const type = v.filter_.valueType ? '^^' + v.filter_.valueType : '';
      return `FILTER(${v.filter_.values
        .map(val => `?${v.subject} ${v.filter_.operator} "${val}"${type}`)
        .join(' || ')})`;
    }
  }

  private varAType(v: GVVar) {
    return this.sAo(v.subject, v.type);
  }

  private sAo(s: string, o: string) {
    return `?${s} a ${o}`;
  }

  beginUnion() {
    this.unionVars_ = [];
    this.unions_.push(this.unionVars_);
    return this;
  }

  endUnion() {
    this.unionVars_ = null;
    return this;
  }

  srcClass() {
    return this.srcClass_;
  }

  orderBy(var_: GVVar, orderAscending = true) {
    this.orderByVar_ = var_;
    this.orderAscending_ = orderAscending;
    return this;
  }

  orderByVarName(varName: string, orderAscending = true) {
    return this.orderBy(this.findVar(varName), orderAscending);
  }

  orderByLastModification() {
    // FIXME: should use lastModificationDate, missing properties in ontology #51
    return this;
  }

  var(var_: GVVar) {
    if (this.unionVars_) {
      this.unionVars_.push(var_);
    } else {
      this.vars_.push(var_);
    }
    return this;
  }

  vars(vars: GVVar[]) {
    if (this.unionVars_) {
      this.unionVars_ = this.unionVars_.concat(vars);
    } else {
      this.vars_ = this.vars_.concat(vars);
    }
    return this;
  }

  private findVar(varName: string) {
    return this.unions_
      .reduce((acc, value) => acc.concat(value), this.vars_)
      .find((v: GVVar) => v.name === varName);
  }

  query() {
    return `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/simple/v2#>
PREFIX ${ONTO_PREFIX}: <${this.knoraApiBaseUrl}/ontology/${this.projectCode}/${
      this.projectShortname
    }/simple/v2#>

CONSTRUCT {
  ?${this.srcClass_.subject} knora-api:isMainResource true .
  ${this.construct(this.vars_)}
  ${this.unions_.map(vars => this.construct(vars)).join('\n')}
} WHERE {
  ${
    this.srcClass_.ids_
      ? this.srcClass_.ids_
          .map(id => ` { BIND(<${id}> AS ?${this.srcClass_.subject}) }\n`)
          .join('\nUNION ')
      : ''
  }
  ${this.sAo(this.srcClass_.subject, 'knora-api:Resource')} .
  ${this.sAo(this.srcClass_.subject, this.srcClass_.predicate)} .
  ${
    this.srcClass_.classesExcludes_
      ? this.srcClass_.classesExcludes_
          .map(
            c =>
              `FILTER NOT EXISTS { ${this.sAo(
                this.srcClass_.subject,
                c.predicate
              )} . }`
          )
          .join('\n')
      : ''
  }
  ${this.properties(this.vars_)}
  ${this.unions_.map(vars => this.properties(vars, true)).join('\n')}

}
${
      this.orderByVar_
        ? `ORDER BY ${this.orderAscending_ ? 'ASC' : 'DESC'}(?${
            this.orderByVar_.subject
          })`
        : ''
    }
`;
  }
}
