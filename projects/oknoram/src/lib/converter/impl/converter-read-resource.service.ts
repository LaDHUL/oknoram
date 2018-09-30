import { Inject, Injectable } from '@angular/core';
import {
  ReadBooleanValue,
  ReadDateValue,
  ReadDecimalValue,
  ReadIntegerValue,
  ReadLinkValue,
  ReadListValue,
  ReadPropertyItem,
  ReadResource,
  ReadTextValueAsString,
  ReadTextValueAsXml
} from '@knora/core';
import { PartialDate, Period } from '../../mapping/period';
import { PropertyCardinality } from '../../mapping/property-cardinality';
import { PropertyType } from '../../mapping/property-type';
import { ResourceMapping } from '../../mapping/resource-mapping';
import { OknoramConfig, OknoramConfigToken } from '../../oknoram-config';
import { ConverterService } from '../converter.service';

@Injectable({
  providedIn: 'root'
})
export class ConverterReadResourceService implements ConverterService {
  constructor(@Inject(OknoramConfigToken) private config: OknoramConfig) {}

  convert<T>(rm: ResourceMapping, res: ReadResource): T {
    const obj = {};
    obj[rm.iri] = res.id;
    if (rm.label) {
      obj[rm.label] = res.label;
    }
    rm.attributes.forEach((att, key) => {
      let attName = `${this.config.knoraApiBaseUrl}/ontology/${
        rm.def.projectCode
      }/${rm.def.projectShortname}/v2#${att.name}`;
      if (att.type === PropertyType.LinkValue) {
        attName = attName + 'Value';
      }
      if (!att.optional && res.properties && !(attName in res.properties)) {
        throw new Error(`Cannot find property ${attName} in Knora resource`);
      } else if (res.properties && attName in res.properties) {
        if (
          att.cardinality &&
          att.cardinality === PropertyCardinality.SingleValue
        ) {
          obj[key] = this.readValueConvert(
            res.properties[attName][0],
            att.type
          );
        } else {
          obj[key] = res.properties[attName].map(v =>
            this.readValueConvert(v, att.type)
          );
        }
      } else {
        obj[key] = null;
      }
    });
    return obj as T;
  }

  private readValueConvert(value: ReadPropertyItem, type: PropertyType) {
    switch (type) {
      case PropertyType.TextValue:
        return (<ReadTextValueAsString>value).str;
      case PropertyType.RichTextValue:
        return (<ReadTextValueAsXml>value).xml;
      case PropertyType.BooleanValue:
        return (<ReadBooleanValue>value).bool;
      case PropertyType.IntValue:
        return (<ReadIntegerValue>value).integer;
      case PropertyType.DecimalValue:
        return (<ReadDecimalValue>value).decimal;
      case PropertyType.LinkValue:
        return (<ReadLinkValue>value).referredResourceIri;
      case PropertyType.ListValue:
        return (<ReadListValue>value).listNodeIri;
      case PropertyType.DateValue:
        return this.toPeriod(<ReadDateValue>value);
      default:
        throw new Error(
          `Not yet managed read value converter for property type ${type}`
        );
    }
  }

  private toPeriod(dateValue: ReadDateValue): Period {
    return {
      calendar: dateValue.calendar,
      start: {
        era: dateValue.startEra,
        year: dateValue.startYear,
        month: dateValue.startMonth,
        day: dateValue.startDay
      } as PartialDate,
      end: dateValue.endYear
        ? ({
            era: dateValue.endEra,
            year: dateValue.endYear,
            month: dateValue.endMonth,
            day: dateValue.endDay
          } as PartialDate)
        : null
    } as Period;
  }
}
