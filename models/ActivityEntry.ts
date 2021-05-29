import { Nullable, NullableObjectFields } from '../types/General';
import Activity, { IActivityData, IActivityPayload } from './Activity';
import { IModelBaseNoTimestamps } from './ModelBase';

interface IGlobalActivityData {
  originalIndex: number;
  widthRatio: number;
  normalisedTitleIndex: number;
  startRatio: number;
  overflowsDay?: boolean;
  widthRatioCapped?: number;
}
interface IGlobalActivityDetails extends IGlobalActivityData, IModelBaseNoTimestamps<IGlobalActivityDetailsPayload> {}
interface IGlobalActivityDetailsPayload extends IGlobalActivityData {
  activity: IActivityPayload;
}

export default class ActivityEntry implements IGlobalActivityDetails  {
  private activity: Activity;
  originalIndex = -1
  widthRatio = 0;
  startRatio = 0;
  normalisedTitleIndex = -1;
  widthRatioCapped = 0;
  overflowsDay = false;

  constructor(activity: Activity, theData: IGlobalActivityData) {
    this.activity = activity;
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
  get data(): NullableObjectFields<IActivityData> {
    return this.activity.data;
  }
  toJSON(): IGlobalActivityDetailsPayload {
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
  static fromJSON({ activity, ...theData }: IGlobalActivityDetailsPayload): ActivityEntry {
    const activityModel = Activity.fromJSON(activity); 
    const entry = new ActivityEntry(activityModel, theData);
    return entry;
  }
  clone(): IGlobalActivityDetails {
    const activity = this.activity.clone();
    const theData: IGlobalActivityData = {
      originalIndex: this.originalIndex,
      widthRatio: this.widthRatio,
      normalisedTitleIndex: this.normalisedTitleIndex,
      startRatio: this.startRatio
    }
    return new ActivityEntry(activity, theData);
  }
}