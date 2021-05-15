import moment, { Moment } from "moment";

expect.extend({
  toBeMomentObject(value: Moment, hh, mm) {
    const isMoment = moment.isMoment(value);
    let pass: boolean, message: string;
    if (isMoment&&hh&&mm) {
      const hours = value.hours();
      const minutes = value.minutes();
      const matchesHour = hours === parseInt(hh);
      const matchesMinutes = minutes === parseInt(mm);
      const matchesTime = matchesHour && matchesMinutes;
      pass = isMoment && matchesTime;
      message = matchesTime ? "Is moment object" : `${hours}:${minutes} doesn't match expected ${hh}:${mm}`;
    } else if (isMoment) {
      pass = isMoment;
      message = "Is moment object";
    } else {
      pass = false;
      message = "Is not moment object";
    }
    return { pass, message: () => message };
  }
})