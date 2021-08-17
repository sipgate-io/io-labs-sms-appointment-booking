import { expect, test, describe } from "@jest/globals";
import { parse, getUpcomingDate } from "../src/parse.js";
import { SmsParseError, PhoneNumberError } from "../src/errors.js";
import { parseWorkingTime } from "../src/util/environment";
import { parseDateString } from "../src/util/date";

describe("Parse function", () => {
  const startDate = { hour: 8, minute: 0 };
  const endDate = { hour: 15, minute: 0 };
  const source = "+49203928694000";
  const currentDate = new Date(2021, 1, 10, 14, 0);

  test("should throw an error when the phonenumber is not valid according to E164", () => {
    const SMS = {
      source: "+490asfasfd112",
      smsContent: "Termin: 25.02, 14:00, Coding",
    };
    expect(() => parse(SMS, startDate, endDate, currentDate)).toThrow(
      `Keine gültige E164 Telefonnummer: ${SMS.source}`
    );
    expect(() => parse(SMS, startDate, endDate, currentDate)).toThrow(
      PhoneNumberError
    );
  });

  test("should throw an error when the phonenumber is too short", () => {
    const SMS = {
      source: "+491111",
      smsContent: "Termin: 25.02, 14:00, Coding",
    };
    expect(() => parse(SMS, startDate, endDate, currentDate)).toThrow(
      `Keine gültige E164 Telefonnummer: ${SMS.source}`
    );
    expect(() => parse(SMS, startDate, endDate, currentDate)).toThrow(
      PhoneNumberError
    );
  });

  test("should throw an error when the phonenumber is too long", () => {
    const SMS = {
      source: "+4911111111111111111111",
      smsContent: "Termin: 25.02, 14:00, Coding",
    };
    expect(() => parse(SMS, startDate, endDate, currentDate)).toThrow(
      `Keine gültige E164 Telefonnummer: ${SMS.source}`
    );
    expect(() => parse(SMS, startDate, endDate, currentDate)).toThrow(
      PhoneNumberError
    );
  });

  test("should throw an error when smsContent contains no input", () => {
    const SMS = {
      source: "+491111111111111",
      smsContent: "",
    };
    expect(() => parse(SMS, startDate, endDate, currentDate)).toThrow(
      "Die Eingabe war fehlerhaft, bitte überprüfe deinen Input."
    );
    expect(() => parse(SMS, startDate, endDate, currentDate)).toThrow(
      SmsParseError
    );
  });

  test("should throw an error when the date could not be parsed", () => {
    const SMS = {
      source: source,
      smsContent: "Termin: 25.02, 18:AA, Coding",
    };
    expect(() => parse(SMS, startDate, endDate, currentDate)).toThrow(
      "Die Eingabe war fehlerhaft, bitte überprüfe deinen Input."
    );
    expect(() => parse(SMS, startDate, endDate, currentDate)).toThrow(
      SmsParseError
    );
  });

  test("should throw an error when the day in the month is invalid", () => {
    const SMS = {
      source: source,
      smsContent: "Termin: 32.02, 15:00, Coding",
    };
    expect(() => parse(SMS, startDate, endDate, currentDate)).toThrow(
      "Sorry, den Tag gibt es in dem Monat nicht."
    );
    expect(() => parse(SMS, startDate, endDate, currentDate)).toThrow(
      SmsParseError
    );
  });

  test("should throw an error when the month is invalid", () => {
    const SMS = {
      source: source,
      smsContent: "Termin: 01.14, 18:00, Coding",
    };
    expect(() => parse(SMS, startDate, endDate, currentDate)).toThrow(
      "Sorry, den Monat gibt es nicht."
    );
    expect(() => parse(SMS, startDate, endDate, currentDate)).toThrow(
      SmsParseError
    );
  });

  test("should throw an error when the appointment is not at a full hour", () => {
    const SMS = {
      source: source,
      smsContent: "Termin: 25.02, 12:15, Coding",
    };
    expect(() => parse(SMS, startDate, endDate, currentDate)).toThrow(
      "Du kannst nur Termine zur vollen Stunde buchen."
    );
    expect(() => parse(SMS, startDate, endDate, currentDate)).toThrow(
      SmsParseError
    );
  });

  test("should throw an error when the appointment is not within the opening hours", () => {
    const SMS = {
      source: source,
      smsContent: "Termin: 25.02, 18:00, Coding",
    };
    expect(() => parse(SMS, startDate, endDate, currentDate)).toThrow(
      `Du kannst nur zwischen ${String(startDate.hour).padStart(
        2,
        "0"
      )}:${String(startDate.minute).padStart(2, "0")} und ${String(
        endDate.hour
      ).padStart(2, "0")}:${String(endDate.minute).padStart(
        2,
        "0"
      )} einen Termin buchen.`
    );
    expect(() => parse(SMS, startDate, endDate, currentDate)).toThrow(
      SmsParseError
    );
  });

  test("should throw an error when month is written incorrectly", () => {
    const SMS = {
      source: source,
      smsContent:
        "Ich möchte einen Termin am 2 Deczember um 14:00 Uhr buchen zum Haare schneiden.",
    };
    expect(() => parse(SMS, startDate, endDate, currentDate)).toThrow(
      "Die Eingabe war fehlerhaft, bitte überprüfe deinen Input."
    );
    expect(() => parse(SMS, startDate, endDate, currentDate)).toThrow(
      SmsParseError
    );
  });

  test("should return subject and date when everything could be parsed", () => {
    const SMS = {
      source: source,
      smsContent: "Termin: 25.02, 14:00, 14:00, Coding",
    };
    const { subject, date } = parse(SMS, startDate, endDate, currentDate);
    expect(subject).toBe("Termin: 25.02, 14:00, 14:00, Coding");
    const otherDate = new Date(2021, 1, 25, 14, 0);
    expect(date).toStrictEqual(otherDate);
  });

  test("should return subject and date when everything could be parsed", () => {
    const SMS = {
      source: source,
      smsContent: "Termin: 25.02, 14:00, Coding",
    };
    const { subject, date } = parse(SMS, startDate, endDate, currentDate);
    expect(subject).toBe("Termin: 25.02, 14:00, Coding");
    const otherDate = new Date(2021, 1, 25, 14, 0);
    expect(date).toStrictEqual(otherDate);
  });

  test("should return subject and date when unformatted sms could be parsed", () => {
    const SMS = {
      source: source,
      smsContent:
        "Ich möchte einen Termin am 2. July 2021 um 14 Uhr buchen zum Haare schneiden.",
    };
    const { date } = parse(SMS, startDate, endDate, currentDate);
    const otherDate = new Date(2021, 6, 2, 14, 0);
    expect(date).toStrictEqual(otherDate);
  });

  test("should return subject and date when unformatted sms could be parsed", () => {
    const SMS = {
      source: source,
      smsContent:
        "Ich möchte einen Termin am 02.07.2021 14:00 Uhr buchen zum Haare schneiden.",
    };
    const { date } = parse(SMS, startDate, endDate, currentDate);
    const otherDate = new Date(2021, 6, 2, 14, 0);
    expect(date).toStrictEqual(otherDate);
  });

  test("should return subject and date when unformatted sms could be parsed when date is in the past", () => {
    const SMS = {
      source: source,
      smsContent:
        "Ich möchte einen Termin am 02.01.2021 14:00 Uhr buchen zum Haare schneiden.",
    };
    const { date } = parse(SMS, startDate, endDate, currentDate);
    const otherDate = new Date(2022, 0, 2, 14, 0);
    expect(date).toStrictEqual(otherDate);
  });

  test("should return subject and date when unformatted sms could be parsed when no year is given", () => {
    const SMS = {
      source: source,
      smsContent:
        "Ich möchte einen Termin am 2 Mai um 14:00 Uhr buchen zum Haare schneiden.",
    };
    const { date } = parse(SMS, startDate, endDate, currentDate);
    const otherDate = new Date(2021, 4, 2, 14, 0);
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
    const actual = parseWorkingTime(time);
    expect(actual).toStrictEqual(expected);
  });

  test("should throw an error when given an invalid hour", () => {
    const time = "26:30";
    expect(() => {
      parseWorkingTime(time);
    }).toThrow(SmsParseError);
    expect(() => {
      parseWorkingTime(time);
    }).toThrow(
      "Sorry, die Stunden sind außerhalb des gültigen Bereichs, die Stundenanzahl muss zwischen 0 und 23 Stunden liegen."
    );
  });

  test("should throw an error when given an invalid minute", () => {
    const time = "08:70";
    expect(() => {
      parseWorkingTime(time);
    }).toThrow(SmsParseError);
    expect(() => {
      parseWorkingTime(time);
    }).toThrow(
      "Sorry, die Minuten sind außerhalb des gültigen Bereichs, der gültige Bereich der Minuten liegt zwischen 0 und 59."
    );
  });
});

describe("ParseDate function", () => {
  //const currentDate = new Date(2021, 1, 10, 14, 0);
  test("should parse valid date without year; (dd.MM)", () => {
    const date = "01.08";
    const result = parseDateString(date);
    expect(result).toStrictEqual({ day: 1, month: 8, year: NaN });
  });
  test("should parse valid date with year; (dd.MM.yyyy)", () => {
    const date = "01.08.2021";
    const result = parseDateString(date);
    expect(result).toStrictEqual({ day: 1, month: 8, year: 2021 });
  });
});

describe("getUpcoming function", () => {
  const currentDate = new Date(2021, 1, 10, 14, 0);
  test("should return date with upcoming year", () => {
    const day = "1";
    const month = "1";
    const hour = "12";
    const minute = "0";
    const result = getUpcomingDate(month, day, hour, minute, currentDate);
    expect(result).toStrictEqual(new Date(2022, 0, 1, 12, 0));
  });
  test("should return date with current year", () => {
    const day = "1";
    const month = "3";
    const hour = "12";
    const minute = "0";
    const result = getUpcomingDate(month, day, hour, minute, currentDate);
    expect(result).toStrictEqual(new Date(2021, 2, 1, 12, 0));
  });
});
