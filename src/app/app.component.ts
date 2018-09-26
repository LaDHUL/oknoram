import { Component, OnInit } from '@angular/core';
import {
  ReadBooleanValue,
  ReadDateValue,
  ReadDecimalValue,
  ReadIntegerValue,
  ReadLinkValue,
  ReadListValue,
  ReadTextValueAsString
} from '@knora/core';
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
  texts: ReadTextValueAsString[];

  @Property({
    type: PropertyType.BooleanValue,
    name: 'hasBoolean',
    optional: true
  })
  booleans: ReadBooleanValue[];

  @Property({
    type: PropertyType.IntValue,
    name: 'hasInteger',
    optional: true
  })
  integers: ReadIntegerValue[];

  @Property({
    type: PropertyType.DecimalValue,
    name: 'hasDecimal',
    optional: true
  })
  decimals: ReadDecimalValue[];

  @Property({
    type: PropertyType.DateValue,
    name: 'hasDate',
    optional: true
  })
  dates: ReadDateValue[];

  @Property({
    type: PropertyType.ListValue,
    name: 'hasListItem',
    optional: true
  })
  lists: ReadListValue[];

  @Property({
    type: PropertyType.LinkValue,
    name: 'hasOtherThing',
    optional: true
  })
  otherThings: ReadLinkValue[];
}

@Resource({
  name: 'BlueThing',
  projectCode: '0001',
  projectShortname: 'anything',
  extend: ThingModel
})
export class BlueThingModel extends ThingModel {
  @Property({
    type: PropertyType.LinkValue,
    name: 'hasBlueThing',
    optional: true
  })
  blueThings: ReadLinkValue[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  thingsCount$: Observable<number>;
  thingsPage: Page<ThingModel>;
  blueThingsCount$: Observable<number>;
  blueThingsPage: Page<BlueThingModel>;
  firstThing: ThingModel;
  pageIndex = 0;
  loading = false;

  constructor(private oknoramService: OknoramService) {}

  ngOnInit() {
    this.thingsCount$ = this.oknoramService.count(ThingModel);
    this.blueThingsCount$ = this.oknoramService.count(BlueThingModel);
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
    this.oknoramService
      .findAll<BlueThingModel>(
        BlueThingModel,
        this.blueThingsPage
          ? this.blueThingsPage.pageRequest(this.pageIndex)
          : null
      )
      .subscribe(page => {
        this.loading = false;
        this.blueThingsPage = page;
      });
  }
}
