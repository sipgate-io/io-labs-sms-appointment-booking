import { parse } from "./parse.js";
import { writeDB } from "./db.js";
import { SmsParseError, AppointmentTakenError, PhoneNumberError } from "./errors.js";
import {sendSms} from "./sendSms.js";

export function handleAllSms(response, startDate, endDate, client, currentDate) {
  response.forEach((sms) => {
    handleSms(sms, startDate, endDate, client, currentDate);
  });
}

export function handleSms(sms, startDate, endDate, client, currentDate) {
  try {
    const { subject, date } = parse(sms, startDate, endDate, currentDate);

    writeDB(subject, date);
    sendSms(`Dein Termin am ${date.toLocaleDateString("de-DE")} um ${date.toLocaleTimeString("de-DE")} wurde erfolgreich gebucht.`, client, sms.source);

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
        console.warn(e.message + "    Unexpected error.");
        // sendSms(e.message);
        break;
    }
  }
}