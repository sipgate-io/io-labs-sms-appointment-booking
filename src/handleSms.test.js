import { SmsParseError, AppointmentTakenError } from "./errors.js";
import { handleSms } from "./handleSms";
import * as handleSmsModule from "./handleSms";
import * as dbModule from "./db";
import * as parseModule from "./parse";
import mockResponse from "./mockSms.js"



describe("handleAllSms", () => {});

describe("hanldeSms", () => {
  const mockAppointment = {
    subject: "asfd",
    date: Date.now(),
  };
  const sms = mockResponse[0];
  const startDate = {hour: 9, minute: 0};
  const endDate = {hour: 16, minute: 0} ;

  test("should try writing to the DB and send an SMS if an appointment was taken", () => {
    const parse = jest.spyOn(parseModule, "parse").mockReturnValue(mockAppointment);
    const writeDB = jest.spyOn(dbModule, "writeDB");
    const sendSms = jest.spyOn(handleSmsModule, "sendSms");

    handleSms(mockResponse[0], startDate, endDate);
    expect(parse).toBeCalledWith(sms.smsContent, startDate, endDate);
    expect(writeDB).toBeCalledWith(mockAppointment.subject, mockAppointment.date);
    expect(sendSms).toBeCalledWith("Your appointment is made");
  });

  test("should try writing to the DB and send an error message per SMS if an appointment is not available", () => {
    const parse = jest.spyOn(parseModule, "parse").mockReturnValue(mockAppointment);
    const writeDB = jest.spyOn(dbModule, "writeDB").mockImplementation(() => {
      throw new AppointmentTakenError("Appointment taken");
    });
    const sendSms = jest.spyOn(handleSmsModule, "sendSms");

    handleSms(mockResponse[0], startDate, endDate);
    expect(parse).toBeCalledWith(sms.smsContent, startDate, endDate);
    expect(writeDB).toBeCalledWith(mockAppointment.subject, mockAppointment.date);
    expect(sendSms).toBeCalledWith("Appointment taken");
  })
});
