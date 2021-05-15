import { ExtraData, Nullable, NullableObjectFields } from '../types/General';
import Activity, { ActivityData, ActivityPayload } from './Activity';
import { ModelBase } from './ModelBase';

interface GlobalActivityData {
  originalIndex: number;
  widthRatio: number;
  normalisedTitleIndex: number;
  startRatio: number;
  overflowsDay?: boolean;
  widthRatioCapped?: number;
}
interface GlobalActivityDetails extends GlobalActivityData, ModelBase<GlobalActivityDetailsPayload> {}
interface GlobalActivityDetailsPayload extends GlobalActivityData {
  activity: ActivityPayload;
}


export default class ActivityEntry implements GlobalActivityDetails {
  originalIndex: number = -1
  widthRatio: number = 0;
  startRatio: number = 0;
  normalisedTitleIndex: number = -1;
  widthRatioCapped: number = 0;
  overflowsDay: boolean = false;
  constructor(private activity: Activity, theData: GlobalActivityData) {
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
  toJSON(): GlobalActivityDetailsPayload {
    return {
      activity: this.activity.toJSON(),
      originalIndex: this.originalIndex,
      widthRatio: this.widthRatio,
      startRatio: this.startRatio,
      normalisedTitleIndex: this.normalisedTitleIndex,
      widthRatioCapped: this.widthRatioCapped,
      overflowsDay: this.overflowsDay
    }
  }
  static fromJSON({ activity, ...theData }: GlobalActivityDetailsPayload): ActivityEntry {
    const activityModel = Activity.fromJSON(activity); 
    const entry = new ActivityEntry(activityModel, theData);
    return entry;
  }
  clone(): ActivityEntry {
    const activity = this.activity.clone();
    const theData: GlobalActivityData = {
      originalIndex: this.originalIndex,
      widthRatio: this.widthRatio,
      normalisedTitleIndex: this.normalisedTitleIndex,
      startRatio: this.startRatio
    }
    return new ActivityEntry(activity, theData);
  }
}