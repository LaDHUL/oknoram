# oknoram

This project provides a simple **O**bject **Knora** **M**apping for Typescript language in a Angular app. Like [**ORM**](https://fr.wikipedia.org/wiki/Mapping_objet-relationnel) tools that simplify the link between the **Object Oriented** and **Relational** worlds, this library try to simplify the link between the **Object Oriented** and **Web semantic Knora** worlds.

## Demo

Requirements: a running Knora stack containing the Anything ontology with data.The default configuration point to http://0.0.0.0:3333 or can be changed in the `environment.ts` file.

- clone project
- yarn
- ng build oknoram
- ng s --port 4666
- http://localhost:4666/

## Purpose of the demonstration

We start by defining the mapping of a `Thing` resource to a `ThingModel` Typescript class (here, we just want to get the `iri`, `label` and `hasText` properties:

```typescript
@Resource({ name: 'Thing' })
export class ThingModel {
  @Iri
  id: string;
  @Label
  label: string;
  @Property({ type: PropertyType.TextValue, name: 'hasText', optional: true })
  text: string;
}
```

We configure the module:

```typescript
OknoramModule.forRoot({
  knoraApiBaseUrl: environment.knoraApiBaseUrl,
  projectCode: environment.projectCode,
  projectShortname: environment.projectShortname
} as OknoramConfig);
```

We get resources:

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

## Implementation

How does it work?

- At initialization, the mapping is extracted from Typescript [`Decorators`](https://www.typescriptlang.org/docs/handbook/decorators.html)

- On `OknoramService.findAll<T>(class)` call, we execute the following process:
  1. we generate the `gravsearch` query of the required class from the mapping
  2. we execute the query with the `search extended` Knora API
  3. we convert the `json-ld` result into the instances of the required class
