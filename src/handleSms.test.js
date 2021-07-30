import { SmsParseError, AppointmentTakenError } from "./errors.js";
import { handleSms } from "./handleSms";
import * as sendSmsModule from "./sendSms";
import * as dbModule from "./db";
import * as parseModule from "./parse";
import mockResponse from "./mockSms.js"

describe("handleAllSms", () => {});

describe("handleSms", () => {
  const mockAppointment = {
    subject: "asfd",
    date: new Date(),
  };
  const sms = mockResponse[0];
  const startDate = {hour: 9, minute: 0};
  const endDate = {hour: 16, minute: 0} ;

  test("should write to the DB and send an comfirmation SMS if it is successful", () => {
    const parse = jest.spyOn(parseModule, "parse").mockReturnValue(mockAppointment);
    const writeDB = jest.spyOn(dbModule, "writeDB").mockImplementation(() => {});
    const sendSms = jest.spyOn(sendSmsModule, "sendSms").mockImplementation(() => {});

    handleSms(sms, startDate, endDate);
    expect(parse).toBeCalledTimes(1);
    expect(parse).toBeCalledWith(sms.smsContent, startDate, endDate);
    expect(writeDB).toBeCalledTimes(1);
    expect(writeDB).toBeCalledWith(mockAppointment.subject, mockAppointment.date);
    expect(sendSms).toBeCalledTimes(1);
    expect(sendSms).toBeCalledWith(`Dein Termin am ${mockAppointment.date.toLocaleDateString("de-DE")} um ${mockAppointment.date.toLocaleTimeString("de-DE")} wurde erfolgreich gebucht.`)
  });

  test("should try to parse the SMS and send an error message per SMS if the parsing fails", () => {
    const parse = jest.spyOn(parseModule, "parse").mockImplementation(() => {
      throw new SmsParseError("Parse Error!");
    })
    const writeDB = jest.spyOn(dbModule, "writeDB").mockImplementation(() => {});
    const sendSms = jest.spyOn(sendSmsModule, "sendSms").mockImplementation(() => {});

    handleSms(sms, startDate, endDate);
    expect(parse).toBeCalledWith(sms.smsContent, startDate, endDate);
    expect(writeDB).toBeCalledTimes(0);
    expect(sendSms).toBeCalledTimes(1);
    expect(sendSms).toBeCalledWith("Parse Error!");
  })

  test("should try writing to the DB and send an error message per SMS if an appointment is not available", () => {
    const parse = jest.spyOn(parseModule, "parse").mockReturnValue(mockAppointment);
    const writeDB = jest.spyOn(dbModule, "writeDB").mockImplementation(() => {
      throw new AppointmentTakenError("Appointment taken");
    });
    const sendSms = jest.spyOn(sendSmsModule, "sendSms").mockImplementation(() => {});

    handleSms(sms, startDate, endDate);
    expect(parse).toBeCalledTimes(1);
    expect(parse).toBeCalledWith(sms.smsContent, startDate, endDate);
    expect(writeDB).toBeCalledTimes(1);
    expect(writeDB).toBeCalledWith(mockAppointment.subject, mockAppointment.date);
    expect(writeDB).toThrow(new AppointmentTakenError("Appointment taken"));
    expect(sendSms).toBeCalledTimes(1);
    expect(sendSms).toBeCalledWith("Appointment taken");
  })

  afterEach(() => {
    jest.restoreAllMocks();
  })
});
