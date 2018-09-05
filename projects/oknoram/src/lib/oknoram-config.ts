import { InjectionToken } from '@angular/core';

export const OknoramConfigToken = new InjectionToken<OknoramConfig>(
  'oknoram-config'
);

export interface OknoramConfig {
  knoraApiBaseUrl: string;
  projectCode: string;
  projectShortname: string;
}
