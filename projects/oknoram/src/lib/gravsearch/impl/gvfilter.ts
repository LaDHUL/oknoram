export class GVFilter {
  values: string[];
  operator: string;
  valueType: string;
  constructor(values: string[], operator?: string, valueType?: string) {
    this.values = values;
    this.operator = operator ? operator : '=';
    this.valueType = valueType;
  }
}
