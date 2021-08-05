import { readDB, writeDB } from "../src/db";
import * as dbModule from "../src/db.js";
import { afterEach, expect, jest, test } from "@jest/globals";
import * as fs from "fs";
import { after } from "lodash";
import { AppointmentTakenError } from "../src/errors";

describe("writeDB", () => {
  const appointment = {
    subject: "asdf",
    date: new Date(),
    source: "+491111111111",
  };
  test("should successfully write to the database", () => {
    const writeFileSync = jest
      .spyOn(fs, "writeFileSync")
      .mockImplementation(() => {});
    const readDBSpy = jest.spyOn(dbModule, "readDB").mockReturnValue({});
    expect(() => {
      writeDB(appointment.subject, appointment.date, appointment.source);
    }).not.toThrow();
  });

  test("should throw an exception if the appontment is taken", () => {
    jest.spyOn(fs, "writeFileSync").mockImplementation(() => {});
    jest.spyOn(dbModule, "readDB").mockReturnValue({
      [appointment.date.toISOString()]: {},
    });
    expect(() => {
      writeDB(appointment.subject, appointment.date, appointment.source);
    }).toThrow(
      new AppointmentTakenError(
        "Sorry, zu diesem Zeitpunkt gibt es keinen freien Termin."
      )
    );
  });

  test("should create a new File if file does not exist", () => {
    jest.spyOn(fs, "writeFileSync").mockImplementation(() => {});
    jest.spyOn(dbModule, "readDB").mockReturnValue({});
    jest.spyOn(fs, "existsSync").mockReturnValue(false);
    expect(() => {
      writeDB("", new Date(), "");
    }).not.toThrow();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
