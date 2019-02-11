[![Build Status](https://travis-ci.org/LaDHUL/oknoram.svg?branch=develop)](https://travis-ci.org/LaDHUL/oknoram)
[![codecov](https://codecov.io/gh/LaDHUL/oknoram/branch/develop/graph/badge.svg)](https://codecov.io/gh/LaDHUL/oknoram)

# oknoram

This project provides a simple **O**bject **Knora** **M**apping for Typescript language in a Angular app. Like [**ORM**](https://fr.wikipedia.org/wiki/Mapping_objet-relationnel) tools which simplify the link between the **Object Oriented** and **Relational** worlds, this library tries to simplify the link between the **Object Oriented** and **Web semantic Knora** worlds.

(Highly inspired from [Spring Data Framework](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/))

## Demo

Requirements: a running Knora stack containing the Anything ontology with its data. The default configuration points to http://0.0.0.0:3333 or can be changed in the [`environment.ts`](src/environments/environment.ts) file.

- clone project
- yarn
- ng build oknoram
- ng s --port 4666
- http://localhost:4666/

## Purpose of the demonstration

We start by defining the mapping of a `Thing` resource to a `ThingModel` Typescript class (here, we just want to get the `iri`, `label` and `hasText` properties:

```typescript
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
  texts: string[];
  [...]
}
```

We configure the module:

```typescript
@NgModule({
  [...]
  imports: [
    [...]
    OknoramModule.forRoot({
      knoraApiBaseUrl: environment.knoraApiBaseUrl
    } as OknoramConfig)  ],
[...]
```

We can count resources:

```typescript
thingsCount$: Observable<number>;

constructor(private oknoramService: OknoramService) {}

[...]

this.thingsCount$ = this.oknoramService.count(ThingModel);
```

We can get resources:

```typescript
thingsPage: Page<ThingModel>;
pageIndex = 0;

constructor(private oknoramService: OknoramService) {}

[...]

this.oknoramService.findAll<ThingModel>(
  ThingModel,
  this.thingsPage ? this.thingsPage.pageRequest(this.pageIndex) : null
  ).subscribe(page => this.thingsPage = page);
```

The `Page<T>` interface provides a high level API to deal with the Knora API pagination.

We can get a particular resource by id:

```typescript
aThing: ThingModel;
id = 'KNORA IRI';

constructor(private oknoramService: OknoramService) {}

[...]

this.oknoramService
  .findById<ThingModel>(ThingModel, id)
  .subscribe(res => (this.aThing = res));
```

See source files [`app.component.ts`](src/app/app.component.ts) and [`app.module.ts`](src/app/app.module.ts) for details.

## Implementation

How does it work?

- At initialization, the mapping is extracted from Typescript [`Decorator`](https://www.typescriptlang.org/docs/handbook/decorators.html): [see implementation](projects/oknoram/src/lib/mapping)

- On [`OknoramService`](projects/oknoram/src/lib/core/oknoram.service.ts) call, we execute the following process:

  1. we generate the `gravsearch` query of the required class from the mapping ([`GravsearchService`](projects/oknoram/src/lib/gravsearch/gravsearch.service.ts))
  2. we execute the query with the `search extended` Knora API ([`KnoraApiService`](projects/oknoram/src/lib/knora-api/knora-api.service.ts))
  3. we convert the `json-ld` result into the instances of the required class ([`ConverterService`](projects/oknoram/src/lib/converter/converter.service.ts))

- Default implementation of services (configuration: [`OknoramModule`](projects/oknoram/src/lib/oknoram.module.ts))
  - `OknoramService`: [`OknoramDefaultService`](projects/oknoram/src/lib/core/impl/oknoram-default.service.ts)
  - `GravsearchService`: [`GravsearchGvqueryService`](projects/oknoram/src/lib/gravsearch/impl/gravsearch-gvquery.service.ts)
  - `KnoraApiService`: [`KnoraApiDefaultService`](projects/oknoram/src/lib/knora-api/impl/knora-api-default.service.ts)
  - `ConverterService`: [`ConverterReadResourceService`](projects/oknoram/src/lib/converter/impl/converter-read-resource.service.ts)

## Feature request

_ revamp `PageRequest`? Knora page API is more an iterator API than a page request...
- manage `ForbiddenResource` resource
- cardinality definition to @Property : cardinality = SINGLE | ARRAY
- oknoramService.findAll<ThingModel>(
  ThingModel,
  Sort list def here (or PageRequest API return a Sort list ?)
  )
- oknoramService.findAll<ThingModel>(
  ThingModel,
  Predicate here to provide FILTER
  )
- oknoramService.save<ThingModel>(ThingModel, object) create or save a resource OR save per property to move closer to Knora API ?
- oknoramService.delete(object.id) delete a resource

## Limitations

- `Decorator` being not available for interface and `Typescript` classes not
  supporting multi inheritance, therefore we cannot provide multi inheritance into mapping
