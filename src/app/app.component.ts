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

@Resource({
  name: 'Thing',
  projectCode: '0001',
  projectShortname: 'anything'
})
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
  firstThing: ThingModel;
  pageIndex = 0;
  loading = false;

  constructor(private oknoramService: OknoramService) {}

  ngOnInit() {
    this.thingsCount$ = this.oknoramService.count(ThingModel);
    this.onPageIndex(0);
  }

  onPageIndex(pageIndex: number) {
    this.pageIndex = pageIndex;
    this.loading = true;
    this.oknoramService
      .findAll<ThingModel>(
        ThingModel,
        this.thingsPage ? this.thingsPage.pageRequest(this.pageIndex) : null
      )
      .subscribe(page => {
        this.loading = false;
        this.thingsPage = page;
        if (page.content && page.content.length > 0) {
          this.oknoramService
            .findById<ThingModel>(ThingModel, page.content[0].id)
            .subscribe(res => (this.firstThing = res));
        }
      });
  }
}
