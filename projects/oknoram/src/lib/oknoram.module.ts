import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { KuiCoreModule } from '@knora/core';
import { ConverterService } from './converter/converter.service';
import { ConverterReadresourceService } from './converter/impl/converter-readresource.service';
import { OknoramDefaultService } from './core/impl/oknoram-default.service';
import { OknoramService } from './core/oknoram.service';
import { GravsearchService } from './gravsearch/gravsearch.service';
import { GravsearchGvqueryService } from './gravsearch/impl/gravsearch-gvquery.service';
import { KnoraApiDefaultService } from './knora-api/impl/knora-api-default.service';
import { KnoraApiService } from './knora-api/knora-api.service';
import { OknoramConfig, OknoramConfigToken } from './oknoram-config';

@NgModule({
  imports: [KuiCoreModule, HttpClientModule]
})
export class OknoramModule {
  static forRoot(config: OknoramConfig): ModuleWithProviders {
    KuiCoreModule.forRoot({
      name: 'Knora-ui-test',
      api: config.knoraApiBaseUrl,
      media: '',
      app: ''
    });
    return {
      ngModule: OknoramModule,
      providers: [
        { provide: OknoramConfigToken, useValue: config },
        { provide: OknoramService, useClass: OknoramDefaultService },
        { provide: GravsearchService, useClass: GravsearchGvqueryService },
        { provide: KnoraApiService, useClass: KnoraApiDefaultService },
        { provide: ConverterService, useClass: ConverterReadresourceService }
      ]
    };
  }
}
