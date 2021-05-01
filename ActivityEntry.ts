import Activity, { ActivityData } from './Activity';

interface GlobalActivityDetails {
  originalIndex: number;
  widthRatio: number;
  normalisedTitleIndex: number;
  startRatio: number;
  overflowsDay?: boolean;
  widthRatioCapped?: number;
}
export default class ActivityEntry implements GlobalActivityDetails {
  originalIndex: number = -1
  widthRatio: number = 0;
  startRatio: number = 0;
  normalisedTitleIndex: number = -1;
  widthRatioCapped: number = 0;
  overflowsDay: boolean = false;
  constructor(private activity: Activity, theData: GlobalActivityDetails) {
    this.originalIndex = theData.originalIndex;
    this.widthRatio = theData.widthRatio;
    this.normalisedTitleIndex = theData.normalisedTitleIndex;
    this.startRatio = theData.startRatio;
    this.overflowsDay = theData.overflowsDay ?? false;
    this.widthRatioCapped = theData.widthRatioCapped ?? theData.widthRatio;
  }
  get originalActivity(): Activity {
    return this.activity;
  }
  get uuid(): Nullable<string> {
    return this.activity.uuid;
  }
  get data(): NullableObjectFields<ActivityData> {
    return this.activity.data;
  }
  clone(): ActivityEntry {
    const activity = this.activity.clone();
    const theData: GlobalActivityDetails = {
      originalIndex: this.originalIndex,
      widthRatio: this.widthRatio,
      normalisedTitleIndex: this.normalisedTitleIndex,
      startRatio: this.startRatio
    }
    return new ActivityEntry(activity, theData);
  }
}