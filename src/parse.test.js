import { expect, test, describe } from "@jest/globals";
import { parse, parseTime } from "./parse.js";

describe("Parse function", () => {
  const startDate = { hour: 8, minute: 0 };
  const endDate = { hour: 15, minute: 0 };

  test("should throw an error when the input could not be parsed", () => {
    const TEST_STRING = "Termin: 25.02, 18:AA";
    expect(() => parse(TEST_STRING, startDate, endDate)).toThrowError();
  });

  test("should throw an error when the day in the month is invalid", () => {
    const TEST_STRING = "Termin: 32.02, 15:00, Coding";
    expect(() => parse(TEST_STRING, startDate, endDate)).toThrowError();
  });

  test("should throw an error when the month is invalid", () => {
    const TEST_STRING = "Termin: 01.14, 18:AA, Coding";
    expect(() => parse(TEST_STRING, startDate, endDate)).toThrowError();
  });

  test("should throw an error when the appointment is not at a full hour", () => {
    const TEST_STRING = "Termin: 25.02, 12:15, Coding";
    expect(() => parse(TEST_STRING, startDate, endDate)).toThrowError();
  });

  test("should throw an error when the appointment is out of opening times", () => {
    const TEST_STRING = "Termin: 25.02, 18:00, Coding";
    expect(() => parse(TEST_STRING, startDate, endDate)).toThrowError();
  });

  test("should return subject and date when everything could be parsed", () => {
    const TEST_STRING = "Termin: 25.02, 14:00, Coding";
    const { subject, date } = parse(TEST_STRING, startDate, endDate);
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
    }).toThrowError();
  });

  test("should throw an error when given an invalid minute", () => {
    const time = "08:70";
    expect(() => {
      parseTime(time);
    }).toThrowError();
  });
  /*
  test("should throw an error when a single-digit minute value has no leading zeroes", () => {
    const time = "8:3";
    expect(() => {parseTime(time)}).toThrowError();
  });
  */
});
