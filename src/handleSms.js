import { parse } from "./parse.js";
import { writeDB } from "./db.js";
import { SmsParseError, AppointmentTakenError } from "./errors.js";
import {sendSms} from "./sendSms.js";

export function handleAllSms(response, startDate, endDate) {
  response.forEach((sms) => {
    handleSms(sms, startDate, endDate);
  });
}

export function handleSms(sms, startDate, endDate) {
  try {
    const { subject, date } = parse(sms.smsContent, startDate, endDate);
    writeDB(subject, date);
    sendSms(`Dein Termin am ${date.toLocaleDateString("de-DE")} um ${date.toLocaleTimeString("de-DE")} wurde erfolgreich gebucht.`);
  } catch (e) {
    switch (e.constructor) {
      case SmsParseError:
        console.warn(e.message);
        sendSms(e.message);
        break;
      case AppointmentTakenError:
        console.warn(e.message);
        sendSms(e.message);
        break;
      default:
        console.warn("Unexpected error.");
        // sendSms(e.message);
        break;
    }
  }
}