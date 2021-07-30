import { SmsParseError, AppointmentTakenError } from "./errors.js";
import { handleSms } from "./handleSms";
import * as handleSmsModule from "./handleSms";
import * as dbModule from "./db";
import * as parseModule from "./parse";

describe("handleAllSms", () => {});

describe("hanldeSms", () => {
  const mockAppointment = {
    subject: "asfd",
    date: Date.now(),
  };
  it("should try writing to the DB and send an SMS if an appointment was taken", () => {
    const parse = jest.spyOn(parseModule, "parse").mockReturnValue();
    const writeDB = jest.spyOn(dbModule, "writeDB");
    const sendSms = jest.spyOn(handleSmsModule, "sendSms");

    handleSms({}, {}, {});

    // check spies for called arguments

    parse.mockRestore();
    writeDB.mockRestore();
    sendSms.mockRestore();
  });
});
