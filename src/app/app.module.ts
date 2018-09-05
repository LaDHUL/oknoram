import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OknoramConfig, OknoramModule } from 'oknoram';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    OknoramModule.forRoot({
      knoraApiBaseUrl: environment.knoraApiBaseUrl,
      projectCode: environment.projectCode,
      projectShortname: environment.projectShortname
    } as OknoramConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
