import { Component, OnInit } from '@angular/core';
import {
  Iri,
  Label,
  OknoramService,
  Property,
  PropertyType,
  Resource
} from 'oknoram';
import { Observable } from 'rxjs';

@Resource({ name: 'Thing' })
export class Thing {
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
  title = 'oknoram-app';
  thingsCount$: Observable<number>;
  things$: Observable<Thing[]>;

  constructor(private oknoramService: OknoramService) {}

  ngOnInit() {
    this.thingsCount$ = this.oknoramService.count(Thing);
    this.things$ = this.oknoramService.findAll<Thing>(Thing);
  }
}
