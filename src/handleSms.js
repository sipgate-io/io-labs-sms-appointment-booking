import { parse } from "./parse.js";
import { writeDB } from "./db.js";
import {
  SmsParseError,
  AppointmentTakenError,
  PhoneNumberError,
} from "./errors.js";
import { sendSms } from "./sendSms.js";

export function handleSms(sms, startDate, endDate, client, currentDate) {
  try {
    const { subject, date } = parse(sms, startDate, endDate, currentDate);

    writeDB(subject, date, sms.source);
    const message = `Dein Termin am ${date.toLocaleDateString(
      "de-DE"
    )} um ${date.toLocaleTimeString("de-DE")} wurde erfolgreich gebucht.`;
    sendSms(message, client, sms.source);
  } catch (e) {
    switch (e.constructor) {
      case SmsParseError:
        console.warn(e.message);
        sendSms(e.message, client, sms.source);
        break;
      case AppointmentTakenError:
        console.warn(e.message);
        sendSms(e.message, client, sms.source);
        break;
      case PhoneNumberError:
        console.warn(`Termin nicht gebucht. ${e.message}`);
        break;
      default:
        console.warn(`Termin nicht gebucht. ${e}`);
        break;
    }
  }
}
