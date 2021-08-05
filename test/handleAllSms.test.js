import { handleAllSms } from "../src/handleAllSms.js";
import * as handleSmsModule from "../src/handleSms.js";
import mockResponse from "./mockSms.js";
import { expect } from "@jest/globals";

describe("handleAllSms", () => {
  test("should run without exceptions", () => {
    const handleSmsSpy = jest
      .spyOn(handleSmsModule, "handleSms")
      .mockImplementation(() => {});
    const startDate = { hour: 9, minute: 0 };
    const endDate = { hour: 16, minute: 0 };

    const allSms = mockResponse;
    expect(() => {
      handleAllSms(allSms, startDate, endDate, {});
    }).not.toThrow();
    expect(handleSmsSpy).toHaveBeenCalled();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
});
