export interface KnoraResource {
  readonly id: string;
  readonly label: string;
  readonly properties: Map<string, any>;
}
