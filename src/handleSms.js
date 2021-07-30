import { parse } from "./parse.js";
import { writeDB } from "./db.js";
import { SmsParseError, AppointmentTakenError } from "./errors.js";

export function handleAllSms(response, startDate, endDate) {
  response.forEach((sms) => {
    handleSms(sms, startDate, endDate);
  });
}

export function handleSms(sms, startDate, endDate) {
  try {
    const { subject, date } = parse(sms.smsContent, startDate, endDate);
    writeDB(subject, date);
  } catch (e) {
    switch (e) {
      case e instanceof SmsParseError:
        console.warn(e.message);
        break;
      case e instanceof AppointmentTakenError:
        console.warn(e.message);
        sendSms(e.message);
        break;
      default:
        console.warn("Unexpected error.");
        // sendSms(e.message);
        break;
    }
  }
  sendSms("Your appointment is made")
}

export function sendSms(message) {
  // to be implemented
}
