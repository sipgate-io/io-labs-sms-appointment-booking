import { createHistoryModule, sipgateIO } from "sipgateio";
import * as dotenv from "dotenv";
import { writeDB } from "./db.js";
import { parseTime, parse } from "./parse.js";
import mockResponse from "./mockSms.js";

async function run() {
  dotenv.config();
  // const tokenId = process.env.TOKEN_ID;
  // const token = process.env.TOKEN;
  // const client = sipgateIO({ tokenId, token });
  // const historyModule = createHistoryModule(client);
  // const historyEntries = await historyModule.fetchAll();
  // console.log(historyEntries.filter((entry) => entry.type === "SMS"));

  let startDate = null;
  let endDate = null;
  try {
    startDate = parseTime(process.env.START_TIME);
    endDate = parseTime(process.env.END_TIME);
  } catch (e) {
    console.warn(e.message);
  }

  try {
    const { subject, date } = parse(
      mockResponse[0].smsContent,
      startDate,
      endDate
    );
    writeDB(subject, date);
  } catch (e) {
    console.warn(e.message);
  }
}

run();
