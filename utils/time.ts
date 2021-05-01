import moment, { isMoment, Moment } from 'moment';
import padLeft from 'pad-left';

const TIME_DISPLAY_FORMAT = "HH:mm";
const TIME_READ_PATTERN = /^(\d{1,2})(?::(\d{1,2}))?$/;

/** TYPING */
type TimeObject<theType extends string | number> = { hh: theType; mm: theType };
type TimeInputType = string | Moment | TimeObject<string | number>;
type TimeTypeArgument = 'moment' | 'object:padded' | 'object:numeric' | 'string';
export const isTimeObject = (time: any): time is TimeObject<number | string> => testTimeObject(time, true) || testTimeObject(time, false);
export const isNumericTimeObject = (time: any): time is TimeObject<number> => testTimeObject(time, true);
export const isPaddedTimeObject = (time: any): time is TimeObject<string> => testTimeObject(time, false);
export const isMomentObject = (time: any): time is Moment => moment.isMoment(time);

export function isNumeric(value: TimeInputType): false | number {
  if (!['string', 'number'].includes(typeof value) || !/^\d{1,2}(?:\.\d{1,2})?$/.test(value+'')) return false;
  return Number(value);
}

export const timeTypeArgumentFromValue = (value: TimeInputType): TimeTypeArgument => {
  if(isPaddedTimeObject(value)) return 'object:padded';
  if(isNumericTimeObject(value)) return 'object:numeric';
  if(isMomentObject(value)) return 'moment';
  else return 'string';
}

export const testTimeObject = (time: TimeObject<string | number>, isNumeric: boolean) => {
  const expectedType = isNumeric ? 'number' : 'string';
  return typeof time.hh === expectedType && time.mm === expectedType;
}

/** FORMATTERS */

export const padTime = (time: string | number) => {
  const stringifiedAndFallBacked = typeof time === 'string' ? time : (time??0)+'';
  return padLeft(stringifiedAndFallBacked, 2, '0');
}

/** STRINGIFIERS */

export const stringifyTimeObject = ({hh, mm}: TimeObject<string | number>) => `${padTime(hh)}:${padTime(mm)}`;
export const stringifyMomentObject = (time: Moment) => time.format(TIME_DISPLAY_FORMAT);
export function stringifyTime(time: TimeInputType): string {
  if (isMomentObject(time)) return stringifyMomentObject(time);
  if (isTimeObject(time)) return stringifyTimeObject(time);

  return time + '';
}

/** PARSERS */

export function parseTimeStringToTimeObject(time: string, numeric: true): TimeObject<number>;
export function parseTimeStringToTimeObject(time: string, numeric: false): TimeObject<string>;
export function parseTimeStringToTimeObject (time: string, numeric: true | false = false): TimeObject<number | string>  {
  time = time ?? "";
  const [_, hh, mm] = time.match(TIME_READ_PATTERN)!;

  if ((hh&&isNumeric(hh) === false) || (mm&&isNumeric(mm) === false) || !hh) throw new Error("INVALID TIME FORMAT: " + time);
  const paddedHH = padTime(hh);
  const paddedMM = padTime(mm);

  if (!numeric) return { hh: paddedHH, mm: paddedMM };
  else return { hh: parseInt(paddedHH), mm: parseInt(paddedMM) };
}
export const parseTimeStringToMomentObject = (time: string) => moment(time, ['HH:mm', 'H:mm', 'HH:m', 'H,m']);

export function parseTime<T extends TimeInputType>(time: T): T;
export function parseTime(time: TimeInputType, expect: 'string'): string;
export function parseTime(time: TimeInputType, expect: 'moment'): Moment;
export function parseTime(time: TimeInputType, expect: 'object:padded'): TimeObject<string>;
export function parseTime(time: TimeInputType, expect: 'object:numeric'): TimeObject<number>;
export function parseTime(time: TimeInputType, expect?: TimeTypeArgument ): TimeInputType {
  const returnMoment = expect === 'moment';
  const returnObjectPadded = expect === 'object:padded';
  const returnObjectNumeric = expect === 'object:numeric';

  if (returnMoment && isMomentObject(time)) return time;
  if (returnObjectPadded && isPaddedTimeObject(time)) return time;
  if (returnObjectNumeric && isNumericTimeObject(time)) return time;

  if (isMomentObject(time)) time = stringifyMomentObject(time);
  if (isTimeObject(time)) time = stringifyTimeObject(time);

  // return time object
  if (returnObjectPadded) return parseTimeStringToTimeObject(time, false);
  if (returnObjectNumeric) return parseTimeStringToTimeObject(time, true);
  // return moment
  if (returnMoment) return parseTimeStringToMomentObject(time);

  return time;
}
/** OPERATIONS */

export function timeToMinutesFromMidnight (time: TimeInputType): number {
  const { hh: hours, mm: minutes } = parseTime(time, 'object:numeric');
  return hours*60 + minutes;
}
export function minutesFromMidnightToTime (minutes: number, expect: 'string'): string;
export function minutesFromMidnightToTime (minutes: number, expect: 'moment'): Moment;
export function minutesFromMidnightToTime (minutes: number, expect: 'object:padded'): TimeObject<string>;
export function minutesFromMidnightToTime (minutes: number, expect: 'object:numeric'): TimeObject<number>;
export function minutesFromMidnightToTime (minutes: number, expect: TimeTypeArgument): TimeInputType {
  const hh = Math.floor(minutes / 60);
  const mm = minutes % 60;
  const parsed = parseTime(`${hh}:${mm}`, expect as any);
  return parsed;
}

export function diff (timeA: TimeInputType, timeB: TimeInputType): number {
  const momentA = parseTime(timeA, 'moment');
  const momentB = parseTime(timeB, 'moment');
  return momentA.diff(momentB, 'minutes');
}

type AddTimeOptions = { capMidnight?: boolean };
export function addTime<T extends TimeInputType> (time: T, min: number): T;
export function addTime (time: TimeInputType, min: number, expect: 'string', options?: AddTimeOptions): string;
export function addTime (time: TimeInputType, min: number, expect: 'moment', options?: AddTimeOptions): Moment;
export function addTime (time: TimeInputType, min: number, expect: 'object:padded', options?: AddTimeOptions): TimeObject<string>;
export function addTime (time: TimeInputType, min: number, expect: 'object:numeric', options?: AddTimeOptions): TimeObject<number>;
export function addTime (time: TimeInputType, min: number, expect?: TimeTypeArgument, options?: AddTimeOptions): TimeInputType {
  const { capMidnight = false } = options ?? {};
  expect = expect ?? timeTypeArgumentFromValue(time);
  min = (() => {
    const endtimeInMinutes = timeToMinutesFromMidnight(time) + min; 
    const minutesPastMidnight = endtimeInMinutes - 60*24;
    // cap last duration up to 23:59
    if (minutesPastMidnight >= 0) min = endtimeInMinutes - (minutesPastMidnight + 1);
    return min;
  })();
  const moment = parseTime(time, 'moment').add(min, "minute");
  return parseTime(moment, expect as any);
}
export function floorTime<T extends TimeInputType> (time: T): T;
export function floorTime (time: TimeInputType, expect: 'string'): string;
export function floorTime (time: TimeInputType, expect: 'moment'): Moment;
export function floorTime (time: TimeInputType, expect: 'object:padded'): TimeObject<string>;
export function floorTime (time: TimeInputType, expect: 'object:numeric'): TimeObject<number>;
export function floorTime (time: TimeInputType, expect?: TimeTypeArgument): TimeInputType {
  expect = expect ?? timeTypeArgumentFromValue(time);
  const moment = parseTime(time, 'moment').startOf("hour");
  return parseTime(moment, expect as any);
} 
type CeilTimeOptions = { capMidnight?: true };
export function ceilTime<T extends TimeInputType> (time: T): T;
export function ceilTime (time: TimeInputType, expect: 'string', options: CeilTimeOptions): string;
export function ceilTime (time: TimeInputType, expect: 'moment', options: CeilTimeOptions): Moment;
export function ceilTime (time: TimeInputType, expect: 'object:padded', options: CeilTimeOptions): TimeObject<string>;
export function ceilTime (time: TimeInputType, expect: 'object:numeric', options: CeilTimeOptions): TimeObject<number>;
export function ceilTime (time: TimeInputType, expect?: TimeTypeArgument, options: CeilTimeOptions = {}): TimeInputType {
  const { capMidnight = false } = options;
  expect = expect ?? timeTypeArgumentFromValue(time);
  const moment = parseTime(time, 'moment');
  const mm = moment.minutes();
  const parsed = parseTime(time, expect as any);
  if (mm === 0) return parsed;
  const nextHour = addTime(time, 60, 'moment', { capMidnight });
  if (nextHour.hours() === 23) return parseTime("23:59", expect as any);
  else {
    const floored = floorTime(nextHour);
    return parseTime(floored, expect as any);
  }
}
