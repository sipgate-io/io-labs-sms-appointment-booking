import {
  SmsParseError,
  AppointmentTakenError,
  PhoneNumberError,
} from "../src/errors.js";
import { handleSms } from "../src/handleSms";
import * as sendSmsModule from "../src/sendSms";
import * as dbModule from "../src/db";
import * as parseModule from "../src/parse";
import mockResponse from "./mockSms.js";
import { expect } from "@jest/globals";

describe("handleSms", () => {
  beforeEach(() => {
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });
  const currentDate = new Date(2021, 5, 5, 5, 0);
  const mockAppointment = {
    subject: "asfd",
    date: currentDate,
    source: "+49203928694000",
  };
  const sms = mockResponse[0];
  const startDate = { hour: 9, minute: 0 };
  const endDate = { hour: 16, minute: 0 };

  const client = {};

  test("should write to the DB and send a confirmation SMS if it is successful", () => {
    const parse = jest
      .spyOn(parseModule, "parse")
      .mockReturnValue(mockAppointment);
    const writeDB = jest
      .spyOn(dbModule, "writeDB")
      .mockImplementation(() => {});
    const sendSms = jest
      .spyOn(sendSmsModule, "sendSms")
      .mockImplementation(() => {});

    handleSms(sms, startDate, endDate, client, currentDate);
    expect(parse).toBeCalledTimes(1);
    expect(parse).toBeCalledWith(sms, startDate, endDate, currentDate);
    expect(writeDB).toBeCalledTimes(1);
    expect(writeDB).toBeCalledWith(
      mockAppointment.subject,
      mockAppointment.date,
      mockAppointment.source
    );
    expect(sendSms).toBeCalledTimes(1);
    expect(sendSms).toBeCalledWith(
      `Dein Termin am ${mockAppointment.date.toLocaleDateString(
        "de-DE"
      )} um ${mockAppointment.date.toLocaleTimeString(
        "de-DE"
      )} wurde erfolgreich gebucht.`,
      client,
      sms.source
    );
  });

  test("should write to the DB and send a confirmation SMS for an appointment in the next year", () => {
    const parse = jest
      .spyOn(parseModule, "parse")
      .mockReturnValue({ ...mockAppointment, changedToNextYear: true });
    const writeDB = jest
      .spyOn(dbModule, "writeDB")
      .mockImplementation(() => {});
    const sendSms = jest
      .spyOn(sendSmsModule, "sendSms")
      .mockImplementation(() => {});

    const _currentDate = new Date(2021, 10, 10);
    handleSms(sms, startDate, endDate, client, _currentDate);
    expect(parse).toBeCalledTimes(1);
    expect(parse).toBeCalledWith(sms, startDate, endDate, _currentDate);
    expect(writeDB).toBeCalledTimes(1);
    expect(writeDB).toBeCalledWith(
      mockAppointment.subject,
      mockAppointment.date,
      mockAppointment.source
    );
    expect(sendSms).toBeCalledTimes(1);
    expect(sendSms).toBeCalledWith(
      `Dein Termin am ${mockAppointment.date.toLocaleDateString(
        "de-DE"
      )} um ${mockAppointment.date.toLocaleTimeString(
        "de-DE"
      )} wurde erfolgreich gebucht.`,
      client,
      sms.source
    );
  });

  test("should try to parse the SMS and send an error message per SMS if the parsing fails", () => {
    const parse = jest.spyOn(parseModule, "parse").mockImplementation(() => {
      throw new SmsParseError("Parse Error!");
    });
    const writeDB = jest
      .spyOn(dbModule, "writeDB")
      .mockImplementation(() => {});
    const sendSms = jest
      .spyOn(sendSmsModule, "sendSms")
      .mockImplementation(() => {});

    handleSms(sms, startDate, endDate, client, currentDate);
    expect(parse).toBeCalledWith(sms, startDate, endDate, currentDate);
    expect(writeDB).toBeCalledTimes(0);
    expect(sendSms).toBeCalledTimes(1);
    expect(sendSms).toBeCalledWith("Parse Error!", client, sms.source);
  });

  test("should try to parse the phonenumber and return a PhoneNumberError", () => {
    const parse = jest.spyOn(parseModule, "parse").mockImplementation(() => {
      throw new PhoneNumberError("Phone Number Error!");
    });
    const writeDB = jest
      .spyOn(dbModule, "writeDB")
      .mockImplementation(() => {});
    const sendSms = jest
      .spyOn(sendSmsModule, "sendSms")
      .mockImplementation(() => {});

    handleSms(sms, startDate, endDate, client, currentDate);
    expect(parse).toBeCalledWith(sms, startDate, endDate, currentDate);
    expect(writeDB).toBeCalledTimes(0);
    expect(sendSms).toBeCalledTimes(0);
  });

  test("should throw a generic error", () => {
    const parse = jest.spyOn(parseModule, "parse").mockImplementation(() => {
      throw new Error("Generic Error!");
    });
    const writeDB = jest
      .spyOn(dbModule, "writeDB")
      .mockImplementation(() => {});
    const sendSms = jest
      .spyOn(sendSmsModule, "sendSms")
      .mockImplementation(() => {});

    handleSms(sms, startDate, endDate, client, currentDate);
    expect(parse).toBeCalledWith(sms, startDate, endDate, currentDate);
    expect(writeDB).toBeCalledTimes(0);
    expect(sendSms).toBeCalledTimes(0);
  });

  test("should try writing to the DB and send an error message per SMS if an appointment is not available", () => {
    const parse = jest
      .spyOn(parseModule, "parse")
      .mockReturnValue(mockAppointment);
    const writeDB = jest.spyOn(dbModule, "writeDB").mockImplementation(() => {
      throw new AppointmentTakenError("Appointment taken");
    });
    const sendSms = jest
      .spyOn(sendSmsModule, "sendSms")
      .mockImplementation(() => {});

    handleSms(sms, startDate, endDate, client, currentDate);
    expect(parse).toBeCalledTimes(1);
    expect(parse).toBeCalledWith(sms, startDate, endDate, currentDate);
    expect(writeDB).toBeCalledTimes(1);
    expect(writeDB).toBeCalledWith(
      mockAppointment.subject,
      mockAppointment.date,
      mockAppointment.source
    );
    expect(writeDB).toThrow(new AppointmentTakenError("Appointment taken"));
    expect(sendSms).toBeCalledTimes(1);
    expect(sendSms).toBeCalledWith("Appointment taken", client, sms.source);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
