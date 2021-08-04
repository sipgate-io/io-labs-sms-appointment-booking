import { expect, test, describe } from "@jest/globals";
import { parse, parseTime, parseDate } from "../src/parse.js";
import { SmsParseError, AppointmentTakenError } from "../src/errors.js";


describe("Parse function", () => {
  const startDate = { hour: 8, minute: 0 };
  const endDate = { hour: 15, minute: 0 };
  const source = "+49203928694000";
  const currentDate = new Date(2021, 1, 10, 14, 0);

  test("should throw an error when the date could not be parsed", () => {
    const SMS = {
      source: source,
      smsContent: "Termin: 25.02, 18:AA, Coding"
    };
    expect(() => parse(SMS, startDate, endDate, currentDate)).toThrow(
      new SmsParseError(
        "Das Datum konnte nicht analysiert werden, bitte überprüfe deinen Input."
      )
    );
  });

  test("should throw an error when the day in the month is invalid", () => {
    const SMS = {
      source: source,
      smsContent: "Termin: 32.02, 15:00, Coding"
    };
    expect(() => parse(SMS, startDate, endDate, currentDate)).toThrow(
      new SmsParseError("Sorry, den Tag gibt es in dem Monat nicht.")
    );
  });

  test("should throw an error when the month is invalid", () => {
    const SMS = {
      source: source,
      smsContent: "Termin: 01.14, 18:00, Coding"
    };
    expect(() => parse(SMS, startDate, endDate, currentDate)).toThrow(
      new SmsParseError("Sorry, den Monat gibt es nicht.")
    );
  });

  test("should throw an error when the appointment is not at a full hour", () => {
    const SMS = {
      source: source,
      smsContent: "Termin: 25.02, 12:15, Coding"
    };
    expect(() => parse(SMS, startDate, endDate, currentDate)).toThrow(
      new SmsParseError("Du kannst nur Termine zur vollen Stunde buchen.")
    );
  });

  test("should throw an error when the appointment is out of opening times", () => {
    const SMS = {
      source: source,
      smsContent: "Termin: 25.02, 18:00, Coding"
    };
    expect(() => parse(SMS, startDate, endDate, currentDate)).toThrow(
      new SmsParseError(
        `Du kannst nur zwischen ${String(
          startDate.hour
        ).padStart(2, "0")}:${String(startDate.minute).padStart(
          2,
          "0"
        )} und ${String(endDate.hour).padStart(2, "0")}:${String(
          endDate.minute
        ).padStart(2, "0")} einen Termin buchen.`
      )
    );
  });

  test("should return subject and date when everything could be parsed", () => {
    const SMS = {
      source: source,
      smsContent: "Termin: 25.02, 14:00, Coding"
    };
    const { subject, date } = parse(SMS, startDate, endDate, currentDate);
    expect(subject).toBe("Coding");
    const otherDate = new Date(2021, 1, 25, 14, 0);
    expect(date).toStrictEqual(otherDate);
  });
});

describe("ParseTime function", () => {
  test("should parse a valid time", () => {
    const time = "08:30";
    const expected = {
      hour: 8,
      minute: 30,
    };
    const actual = parseTime(time);
    expect(actual).toStrictEqual(expected);
  });

  test("should throw an error when given an invalid hour", () => {
    const time = "26:30";
    expect(() => {
      parseTime(time);
    }).toThrow(
      new AppointmentTakenError(
        "Sorry, die Stunden sind außerhalb des gültigen Bereichs, die Stundenanzahl muss zwischen 0 und 23 Stunden liegen."
      )
    );
  });

  test("should throw an error when given an invalid minute", () => {
    const time = "08:70";
    expect(() => {
      parseTime(time);
    }).toThrow(
      new AppointmentTakenError(
        "Sorry, die Minuten sind außerhalb des gültigen Bereichs, der gültige Bereich der Minuten liegt zwischen 0 und 59."
      )
    );
  });
  /*
  test("should throw an error when a single-digit minute value has no leading zeroes", () => {
    const time = "8:3";
    expect(() => {parseTime(time)}).toThrow();
  });
  */
});

describe("ParseDate function", () => {
  const currentDate = new Date(2021, 1, 10, 14, 0);
  test("should parse valid date without year; (dd.MM)", () => {
    const date =  "01.08";
    const result = parseDate(date, currentDate);
    expect(result).toStrictEqual({day: 1, month: 8, year: 2021});
  });

});
