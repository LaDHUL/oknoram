import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { KuiCoreModule } from '@knora/core';
import { OknoramConfig, OknoramModule } from 'oknoram';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    OknoramModule.forRoot({
      knoraApiBaseUrl: environment.knoraApiBaseUrl
    } as OknoramConfig),
    KuiCoreModule.forRoot({
      name: '',
      api: environment.knoraApiBaseUrl,
      media: '',
      app: ''
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
