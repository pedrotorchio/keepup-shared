import moment, { isMoment, Moment, unitOfTime } from 'moment';
import padLeft from 'pad-left';

const TIME_DISPLAY_FORMAT = "HH:mm";
const TIME_READ_PATTERN = /^(\d{1,2})(?::(\d{1,2}))?$/;

/** TYPING */
type TimeObject<theType extends string | number> = { hh: theType; mm: theType };
type TimeInputType = string | Moment | TimeObject<string | number>;
type TimeTypeArgument = 'moment' | 'object:padded' | 'object:numeric' | 'string';
type TimeArgumentFor<Input extends TimeInputType> = Input extends TimeObject<string>
  ? 'object:padded'
  : Input extends TimeObject<number>
  ? 'object:numeric'
  : Input extends Moment
  ? 'moment'
  : Input extends string
  ? 'string'
  : never;
type TimeInputFor<Argument extends TimeTypeArgument> = Argument extends 'moment'
  ? Moment
  : Argument extends 'object:padded'
  ? TimeObject<string>
  : Argument extends 'object:numeric'
  ? TimeObject<number>
  : Argument extends 'string'
  ? string
  : never;

export const isTimeObject = (time: any): time is TimeObject<number | string> => isValidTimeObject(time, true) || isValidTimeObject(time, false);
export const isNumericTimeObject = (time: any): time is TimeObject<number> => isValidTimeObject(time, true);
export const isPaddedTimeObject = (time: any): time is TimeObject<string> => isValidTimeObject(time, false) && [time.hh.length, time.mm.length].every(l => l===2) ;
export const isMomentObject = (time: any): time is Moment => moment.isMoment(time);

export function isNumericValue(value: TimeInputType | number): false | number {
  if (!['string', 'number'].includes(typeof value) || !/^\d{1,2}(?:\.\d{1,2})?$/.test(value + '')) return false;
  return Number(value);
}

export const timeTypeArgumentFromValue = (value: TimeInputType): TimeTypeArgument => {
  if (isPaddedTimeObject(value)) return 'object:padded';
  if (isNumericTimeObject(value)) return 'object:numeric';
  if (isMomentObject(value)) return 'moment';
  else return 'string';
}

export const isValidTimeObject = (time: TimeObject<string | number>, isNumeric: boolean): boolean => {
  const expectedType = isNumeric ? 'number' : 'string';
  return typeof time?.hh === expectedType && typeof time?.mm === expectedType;
}

/** FORMATTERS */

export const padInteger = (time: string | number | null) => {
  const stringifiedAndFallBacked = typeof time === 'string' ? time : (time ?? 0) + '';
  return padLeft(stringifiedAndFallBacked, 2, '0');
}
export const padTimeString = (time: string) => {
  const [hh, mm] = time.split(":");
  return `${padInteger(hh)}:${padInteger(mm)}`;
}

/** STRINGIFIERS */

export const stringifyTimeObject = ({ hh, mm }: TimeObject<string | number>) => `${padInteger(hh)}:${padInteger(mm)}`;
export const stringifyMomentObject = (time: Moment) => time.format(TIME_DISPLAY_FORMAT);
export function stringifyTime(time: TimeInputType): string {
  if (isMomentObject(time)) return stringifyMomentObject(time);
  if (isTimeObject(time)) return stringifyTimeObject(time);

  return time + '';
}

/** PARSERS */

export function parseTimeStringToTimeObject(time: string, numeric: true): TimeObject<number>;
export function parseTimeStringToTimeObject(time: string, numeric: false): TimeObject<string>;
export function parseTimeStringToTimeObject(time: string, numeric: true | false = false): TimeObject<number | string> {
  time = time ?? "";
  const [_, hh, mm] = time.match(TIME_READ_PATTERN)!;

  if ((hh && isNumericValue(hh) === false) || (mm && isNumericValue(mm) === false) || !hh) throw new Error("INVALID TIME FORMAT: " + time);
  const paddedHH = padInteger(hh);
  const paddedMM = padInteger(mm);

  if (!numeric) return { hh: paddedHH, mm: paddedMM };
  else return { hh: parseInt(paddedHH), mm: parseInt(paddedMM) };
}
export const parseTimeStringToMomentObject = (time: string) => moment(time, ['HH:mm', 'H:mm', 'HH:m', 'H,m']);

export function parseTime(time: TimeInputType): TimeObject<string>;
export function parseTime(time: TimeInputType, expect: 'string'): string;
export function parseTime(time: TimeInputType, expect: 'moment'): Moment;
export function parseTime(time: TimeInputType, expect: 'object:padded'): TimeObject<string>;
export function parseTime(time: TimeInputType, expect: 'object:numeric'): TimeObject<number>;
export function parseTime(time: TimeInputType, expect: TimeTypeArgument = "object:padded"): TimeInputType {

  if (expect === 'moment' && isMomentObject(time)) return time;
  if (expect === 'object:padded' && isPaddedTimeObject(time)) return time;
  if (expect === 'object:numeric' && isNumericTimeObject(time)) return time;

  if (isMomentObject(time)) time = stringifyMomentObject(time);
  if (isTimeObject(time)) time = stringifyTimeObject(time);

  // return time object
  if (expect === 'object:padded') return parseTimeStringToTimeObject(time, false);
  if (expect === 'object:numeric') return parseTimeStringToTimeObject(time, true);
  // return moment
  if (expect === 'moment') return parseTimeStringToMomentObject(time);

  return padTimeString(time);
}
/** OPERATIONS */

export function minutesFromMidnight(time: TimeInputType): number {
  const { hh: hours, mm: minutes } = parseTime(time, 'object:numeric');
  return hours * 60 + minutes;
}
export function minutesFromMidnightToTime(minutes: number): string;
export function minutesFromMidnightToTime(minutes: number, expect: 'string'): string;
export function minutesFromMidnightToTime(minutes: number, expect: 'moment'): Moment;
export function minutesFromMidnightToTime(minutes: number, expect: 'object:padded'): TimeObject<string>;
export function minutesFromMidnightToTime(minutes: number, expect: 'object:numeric'): TimeObject<number>;
export function minutesFromMidnightToTime(minutes: number, expect: TimeTypeArgument = "object:padded"): TimeInputType {
  const hh = Math.floor(minutes / 60);
  const mm = minutes % 60;
  const parsed = parseTime(`${hh}:${mm}`, expect as any);
  return parsed;
}

export function timeDiff(timeA: TimeInputType, timeB: TimeInputType, timeUnit: unitOfTime.Base = "minutes"): number {
  const momentA = parseTime(timeA, 'moment');
  const momentB = parseTime(timeB, 'moment');
  return momentA.diff(momentB, timeUnit);
}

type AddTimeOptions<Expect extends TimeTypeArgument> = { capMidnight?: boolean, addedUnit?: unitOfTime.Base, expect?: Expect };
// Overloads: 'options.expect' defaults to type of 'time'
export function addTime<V extends TimeInputType>(time: V, amount: number, options?: AddTimeOptions<TimeArgumentFor<V>>): V;
// Overloads: 'options.expect' change the return type
export function addTime(time: TimeInputType, amount: number, options: AddTimeOptions<'string'>): string;
export function addTime(time: TimeInputType, amount: number, options: AddTimeOptions<'moment'>): Moment;
export function addTime(time: TimeInputType, amount: number, options: AddTimeOptions<'object:padded'>): TimeObject<string>;
export function addTime(time: TimeInputType, amount: number, options: AddTimeOptions<'object:numeric'>): TimeObject<number>;
export function addTime(time: TimeInputType, amount: number, options: AddTimeOptions<TimeTypeArgument> = {}): TimeInputType {
  const {
    capMidnight = false,
    addedUnit = "minutes",
    expect = timeTypeArgumentFromValue(time)
  } = options;

  amount = (() => {
    const endtimeInMinutes = minutesFromMidnight(time) + amount;
    const minutesPastMidnight = endtimeInMinutes - 60 * 24;
    // cap last duration up to 23:59
    if (minutesPastMidnight >= 0) amount = endtimeInMinutes - (minutesPastMidnight + 1);
    return amount;
  })();
  const moment = parseTime(time, 'moment').add(amount, addedUnit);
  return parseTime(moment, expect as any);
}
type FloorTypeOptions<Expect extends TimeTypeArgument> = { expect?: Expect };
export function floorTime<T extends TimeInputType>(time: T): T;
export function floorTime(time: TimeInputType, options: FloorTypeOptions<'string'>): string;
export function floorTime(time: TimeInputType, options: FloorTypeOptions<'moment'>): Moment;
export function floorTime(time: TimeInputType, options: FloorTypeOptions<'object:padded'>): TimeObject<string>;
export function floorTime(time: TimeInputType, options: FloorTypeOptions<'object:numeric'>): TimeObject<number>;
export function floorTime(time: TimeInputType, options: FloorTypeOptions<TimeTypeArgument> = {}): TimeInputType {
  const {
    expect = timeTypeArgumentFromValue(time)
  } = options;
  const moment = parseTime(time, 'moment').startOf("hour");
  return parseTime(moment, expect as any);
}
type CeilTimeOptions<Expect extends TimeTypeArgument> = { capMidnight?: true, expect?: Expect };
export function ceilTime<T extends TimeInputType>(time: T): T;
export function ceilTime(time: TimeInputType, options: CeilTimeOptions<'string'>): string;
export function ceilTime(time: TimeInputType, options: CeilTimeOptions<'moment'>): Moment;
export function ceilTime(time: TimeInputType, options: CeilTimeOptions<'object:padded'>): TimeObject<string>;
export function ceilTime(time: TimeInputType, options: CeilTimeOptions<'object:numeric'>): TimeObject<number>;
export function ceilTime(time: TimeInputType, options: CeilTimeOptions<TimeTypeArgument> = {}): TimeInputType {
  const {
    capMidnight = false,
    expect = timeTypeArgumentFromValue(time)
  } = options;
  const moment = parseTime(time, 'moment');
  const mm = moment.minutes();
  const parsed: TimeInputType = parseTime(time, expect as any);
  if (mm === 0) return parsed;
  const nextHour: Moment = addTime(parsed, 60, { capMidnight, expect: "moment" });
  if (nextHour.hours() === 23) return parseTime("23:59", expect as any);
  else {
    const floored = floorTime(nextHour);
    return parseTime(floored, expect as any);
  }
}
