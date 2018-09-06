import { Component, OnInit } from '@angular/core';
import {
  Iri,
  Label,
  OknoramService,
  Page,
  Property,
  PropertyType,
  Resource
} from 'oknoram';
import { Observable } from 'rxjs';

@Resource({ name: 'Thing' })
export class ThingModel {
  @Iri
  id: string;
  @Label
  label: string;
  @Property({ type: PropertyType.TextValue, name: 'hasText', optional: true })
  text: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  thingsCount$: Observable<number>;
  thingsPage: Page<ThingModel>;
  pageIndex = 0;

  constructor(private oknoramService: OknoramService) {}

  ngOnInit() {
    this.thingsCount$ = this.oknoramService.count(ThingModel);
    this.oknoramService
      .findAll<ThingModel>(
        ThingModel,
        this.thingsPage ? this.thingsPage.pageRequest(this.pageIndex) : null
      )
      .subscribe(page => (this.thingsPage = page));
  }
}
