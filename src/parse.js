import { SmsParseError, AppointmentTakenError } from "./errors.js";

export function parse(smsBody, startDate, endDate) {
  let tokens = smsBody
    .split(/Termin:|,/)
    .filter((token) => token !== "")
    .map((token) => token.trim());
  
  if(tokens.length != 3){
    throw new SmsParseError(
      "Die Eingabe war fehlerhaft, bitte überprüfe deinen Input."
    );
  }

  const { day, month, year } = parseDate(tokens[0]);
  const { hour, minute } = parseTime(tokens[1]);
  const subject = tokens[2];
  const date = new Date(year, month - 1, day, hour, minute);
  const now = new Date();
  if(now > date){
    date.setFullYear(year + 1);
  }
  
  if (!isValidDate(date)) {
    throw new SmsParseError(
      "Das Datum konnte nicht analysiert werden, bitte überprüfe deinen Input."
    );
  }

  if (date.getDate() !== day) {
    throw new SmsParseError("Sorry, den Tag gibt es in dem Monat nicht.");
  }

  if (date.getMonth() + 1 !== month) {
    throw new SmsParseError("Sorry, den Monat gibt es nicht.");
  }

  if (minute !== 0) {
    throw new SmsParseError("Du kannst nur Termine zur vollen Stunde buchen.");
  }

  if (hour > endDate.hour || hour < startDate.hour) {
    throw new SmsParseError(
      `Du kannst nur zwischen ${String(
        startDate.hour
      ).padStart(2, "0")}:${String(startDate.minute).padStart(
        2,
        "0"
      )} und ${String(endDate.hour).padStart(2, "0")}:${String(
        endDate.minute
      ).padStart(2, "0")} einen Termin buchen.`
    );
  }

  return { subject, date };
}

export function parseTime(timeString) {
  const hour = parseInt(timeString.split(":")[0]);
  const minute = parseInt(timeString.split(":")[1]);

  if (hour > 23 || hour < 0) {
    throw new AppointmentTakenError(
      "Sorry, die Stunden sind außerhalb des gültigen Bereichs, die Stundenanzahl muss zwischen 0 und 23 Stunden liegen."
    );
  }

  if (minute > 59 || minute < 0) {
    throw new AppointmentTakenError(
      "Sorry, die Minuten sind außerhalb des gültigen Bereichs, der gültige Bereich der Minuten liegt zwischen 0 und 59."
    );
  }

  return { hour, minute };
}

function parseDate(dateString) {
  const day = parseInt(dateString.split(".")[0]);
  const month = parseInt(dateString.split(".")[1]);
  const year = dateString.split(".").length == 3 ? parseInt(dateString.split(".")[2]) : new Date().getFullYear();

  return { month, day, year };
}

function isValidDate(date) {
  return date.getTime() === date.getTime();
}
