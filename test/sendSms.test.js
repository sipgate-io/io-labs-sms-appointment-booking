import { beforeEach, expect, jest, test } from "@jest/globals";
import * as sipgateio from "sipgateio";
import { sendSms } from "../src/sendSms.js";

jest.mock("sipgateio");

const createSMSModule = sipgateio.createSMSModule;

beforeEach(() => {
  createSMSModule.mockReset();
  jest.spyOn(console, "log").mockImplementation(() => {});
});

describe("SendSms", () => {
  test("should succeed", () => {
    process.env.SMS_ID = "s1";
    const client = {};
    const SMSModule = {
      send: jest.fn(() => {}),
    };
    const expected = {
      message: "Hello, world",
      smsId: process.env.SMS_ID,
      to: "+491111111111",
      datetime: expect.any(String),
    };
    createSMSModule.mockReturnValue(SMSModule);
    sendSms(expected.message, client, expected.to);
    expect(createSMSModule).toHaveBeenCalledTimes(2);
    expect(createSMSModule).toBeCalledWith(client);
    expect(SMSModule.send).toHaveBeenCalledTimes(1);
    expect(SMSModule.send).toHaveBeenCalledWith(expected);
  });
});
