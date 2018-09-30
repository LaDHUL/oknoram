export interface PartialDate {
  era: string;
  day: number;
  month: number;
  year: number;
}

export interface Period {
  calendar: string;
  start: PartialDate;
  end: PartialDate;
}
