import { makeResourceMapping, OknoramConfigStub } from '../../test/helpers';
import { GravsearchGvqueryService } from './gravsearch-gvquery.service';

function flatQuery(q: string) {
  return q
    .split('\n')
    .filter(l => l.trim().length > 0)
    .map(l => l.trim());
}

describe('GravsearchGvqueryService', () => {
  let gravsearchService: GravsearchGvqueryService;
  let conf = new OknoramConfigStub();

  beforeEach(() => {
    gravsearchService = new GravsearchGvqueryService(conf);
  });

  it('should be created', () => {
    const rm = makeResourceMapping();
    const resQuery = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/simple/v2#>
PREFIX onto: <${
      conf.knoraApiBaseUrl
    }/ontology/projectCode/projectShortname/simple/v2#>
CONSTRUCT {
  ?resourceName knora-api:isMainResource true .
  ?resourceName onto:strOntoVar ?strOntoVar .
} WHERE {
  ?resourceName a knora-api:Resource .
  ?resourceName a onto:resourceName .

  ?resourceName onto:strOntoVar ?strOntoVar .
  onto:strOntoVar knora-api:objectType xsd:string .
  ?strOntoVar a xsd:string .
}
    `;
    expect(flatQuery(gravsearchService.buildQuery(rm))).toEqual(
      flatQuery(resQuery)
    );
  });
});
