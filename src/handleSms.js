import { parse } from "./parse.js";
import { writeDB } from "./db.js";
import { SmsParseError, AppointmentTakenError } from "./errors.js";
import {sendSms} from "./sendSms.js";

export function handleAllSms(response, startDate, endDate, client) {
  response.forEach((sms) => {
    handleSms(sms, startDate, endDate, client);
  });
}

export function handleSms(sms, startDate, endDate, client) {
  try {
    const { subject, date } = parse(sms.smsContent, startDate, endDate);
    writeDB(subject, date);
    sendSms(`Dein Termin am ${date.toLocaleDateString("de-DE")} um ${date.toLocaleTimeString("de-DE")} wurde erfolgreich gebucht.`, client);
  } catch (e) {
    switch (e.constructor) {
      case SmsParseError:
        console.warn(e.message);
        sendSms(e.message, client);
        break;
      case AppointmentTakenError:
        console.warn(e.message);
        sendSms(e.message, client);
        break;
      default:
        console.warn("Unexpected error.");
        // sendSms(e.message);
        break;
    }
  }
}