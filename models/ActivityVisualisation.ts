import { scaleLinear, scaleQuantize } from 'd3';
import { compareTwoStrings } from 'string-similarity';
import { autonomyList, colors } from '../config';
import { addTime, ceilTime, floorTime, minutesFromMidnight, timeDiff } from '../utils';
import Activity from './Activity';
import ActivityEntry from './ActivityEntry';

const SIMILARITY_RATE = .8;

type ActivityOriginalIndex = { originalIndex: number; activity: Activity };

export const normalise = (s: string) => s.toLowerCase().replace(/[\s-_]/g, "");
export const equals = (s1: string, s2: string) => compareTwoStrings(normalise(s1), normalise(s2)) >= SIMILARITY_RATE;

export function removeDuplicateStringsBasedOnSimilarity(values: string[]): string[] {
  const findIndexOfValue = (niddle: string) => values.findIndex(hay => equals(niddle, hay));
  const filterRepeatedValue = (value: string, i: number) => findIndexOfValue(value) === i;
  const filteredValues = values.filter(filterRepeatedValue).filter(Boolean);
  return filteredValues;
}
const titleGroupFinderFactory = (activityList: Activity[]) => {
  const titleGroups = getTitleGroups(activityList);
  const findTitleGroupIndex = (i: number) => (group: ActivityOriginalIndex[]) => group.find(a => a.originalIndex === i);
  const findTitleGroupIndexByActivityIndex = (i: number) => titleGroups.findIndex(findTitleGroupIndex(i));
  return findTitleGroupIndexByActivityIndex;
}
export const isSimilarEnough = (a: string, b: string) => {
  // is similar enough only applies to words with more than one word, otherwise simple words such as "jantar" and "cantar" 
  // would always be considered the same
  // unless the words are exaclty the same (after removing spaces)
  const countSpaces = (str: string) => Array.from(str).reduce((count, letter)=>{
    return [" ", "-", "_"].includes(letter) ? count + 1 : count;
  }, 0);
  const exactlySame = () => normalise(a) === normalise(b);
  const similarIfLong = () => countSpaces(a) > 1 && countSpaces(b) > 1 && equals(a, b);
  return exactlySame() || similarIfLong();
};
const theTitle = (act: ActivityOriginalIndex) => act.activity.data.shortDescription;
const isEntrySimilarEnough = (title: string) => (other: ActivityOriginalIndex) => {
  const otherTitle = theTitle(other);
  return otherTitle && isSimilarEnough(otherTitle, title);
}
const searchGroupForSimilarTitle = (title: string) => (group: ActivityOriginalIndex[]) => {
  return group.some(isEntrySimilarEnough(title));
}
export const addDurations = <T extends Activity | ActivityEntry>(list: T[]) => {
  return list.reduce((sum: number, curr: T) => {
    return sum + (curr.data.duration??0);
  }, 0)
}
const precision2 = (value: number) => {
  return Math.floor(value*100)/100;
}
export const getTitleGroups = (activityList: Activity[]) => {
  const groups: ActivityOriginalIndex[][] = [];
  activityList.forEach((activity, index: number) => {
    const title = activity.data.shortDescription ?? null;
    if (!title) groups.push([{ activity, originalIndex: index }]);
    else {
      const similarIndex = groups.findIndex(searchGroupForSimilarTitle(title));
      if (similarIndex === -1) groups.push([{ activity, originalIndex: index }]);
      else groups[similarIndex].push({ activity, originalIndex: index });
    }
  })
  return groups;
}
const sortEntries = <T extends ActivityEntry | Activity>(activityEntries: T[]): T[]=> {
  const entries = [...activityEntries];
  const startTime = (act: ActivityEntry | Activity) => act.data.startTime!;
  const startTimeInMinutes = (act: ActivityEntry | Activity) => minutesFromMidnight(startTime(act));
  entries.sort((a, b) => {
    return startTimeInMinutes(a) - startTimeInMinutes(b);
  });
  return entries;
}
type VisualisationConfiguration = {
  roundTime: boolean;
  autonomyRange: [number, number];
};

export const autonomyColorSequence = [
  colors.COLOR__AUTONOMY_1,
  colors.COLOR__AUTONOMY_2,
  colors.COLOR__AUTONOMY_3,
  colors.COLOR__AUTONOMY_4,
  colors.COLOR__AUTONOMY_5,
];
export default class ActivityVisualisation {
  private _activityList: Activity[] = [];
  private _config: VisualisationConfiguration;
  constructor(config: Partial<VisualisationConfiguration> = {}) {
    this._config = {
      roundTime: false,
      autonomyRange: autonomyList.range,
      ...config
    }
  }
  get config(): ActivityVisualisation["_config"] {
    return this._config;
  }
  get startTime(): string | null {
    const sortedActivities = sortEntries(this.nonEmptyActivities);
    const startTime = sortedActivities[0]?.data.startTime ?? null;
    if (!sortedActivities?.length || !startTime) return null;
    return this.config.roundTime ? floorTime(startTime) : startTime;
  }
  get endTime(): string | null {
    const sortedActivities = sortEntries(this.nonEmptyActivities);
    const lastIndex = sortedActivities.length - 1;
    const lastStartTime = sortedActivities[lastIndex]?.data.startTime ?? null;
    if (!sortedActivities?.length || !lastStartTime) return null;
    const lastDuration = sortedActivities[lastIndex].data.duration ?? 0;
    const endTime = addTime(lastStartTime, lastDuration);
    return this.config.roundTime ? ceilTime(endTime, { expect: "string", capMidnight: true }) : endTime;
  }
  get wholeDuration(): number {
    if (this.endTime && this.startTime) return timeDiff(this.endTime, this.startTime);
    return addDurations(this.nonEmptyActivities);
  }
  get durationScale(): (duration: number) => number {
    return (duration: number) => {
      if (!duration) return 0;
      const scale = scaleLinear();
      scale.domain([0,  this.wholeDuration]).range([0, 100]);
      return scale(duration) as number;
    };
  }
  get startTimeScale(): (time: string) => number {
    return (time: string) => {
      const timeZero = this.startTime;
      // if there's no start time reference,
      // make all of them start in zero
      if (!timeZero || !time) return 0;
      const startTimeInMinutes = timeDiff(time, timeZero);
      return this.durationScale(startTimeInMinutes) as number;
    }
  }
  get autonomyColorScale(): (autonomy: number) => string {

    return (autonomy: number) => {
      const autonomyValues = this.config.autonomyRange;
      const scale = scaleQuantize<string>()
        .domain(autonomyValues)
        .range(autonomyColorSequence);

      return scale(autonomy) as string;
    }
  }
  get nonEmptyActivities(): Activity[] {
    const has = (a: Activity, data: string) => Boolean(a.data[data]);
    const hasMininumInfo = (a: Activity) => has(a, 'autonomy') && has(a, 'duration') && has(a, 'startTime');
    const allActivities = this._activityList;
    return allActivities.filter(hasMininumInfo);
  }
  get activityList(): Activity[] {
    return this._activityList;
  }
  set activityList(value: Activity[]) {
    this._activityList = value;
  }
  get activityEntries(): ActivityEntry[] {
    const nonEmptyActivities = this.nonEmptyActivities;
    const completeActivities = nonEmptyActivities.filter(a => a.isComplete);
    const findTitleGroupIndexByActivityIndex = titleGroupFinderFactory(completeActivities);
    const overflowsDay = (act: Activity) => {
      const duration = act.data.duration;
      const startTime = act.data.startTime;
      const minutes = minutesFromMidnight(startTime!) + duration!;

      return minutes >= 24*60;
    }
    const cappedDuration = (activity: Activity): number => {
      const { startTime, duration } = activity.data;
      const minsFromMidnight = minutesFromMidnight(startTime!) + duration!;
      const minutesPastMidnight = minsFromMidnight - 24*60;
      if (minutesPastMidnight >= 0) return duration! - (minutesPastMidnight + 1);
      return duration!;
    }
    const entries = completeActivities.map((activity, i) => new ActivityEntry(activity, {
      originalIndex: i,
      normalisedTitleIndex: findTitleGroupIndexByActivityIndex(i),
      widthRatio: precision2(this.durationScale(activity.data.duration!)),
      widthRatioCapped: precision2(this.durationScale(cappedDuration(activity))),
      startRatio: precision2(this.startTimeScale(activity.data.startTime!)),
      overflowsDay: overflowsDay(activity)
    }));

    return entries;
  }
  get sortedEntries(): ActivityEntry[] {
    return sortEntries(this.activityEntries);
  }


}