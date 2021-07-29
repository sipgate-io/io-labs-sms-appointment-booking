// import { createHistoryModule, sipgateIO } from "sipgateio";
import * as dotenv from "dotenv";
import { writeDB } from "./db.js";
import { parseTime, parse } from "./parse.js";
dotenv.config();

const TEST_STRING = "Termin: 28.02, 13:00, Treffen im Park";

async function run() {
  /*
    const tokenId = process.env.TOKEN_ID;
    const token = process.env.TOKEN;
    const client = sipgateIO({ tokenId, token });
    const historyModule = createHistoryModule(client);
    const historyEntries = await historyModule.fetchAll();
    console.log(historyEntries.filter(entry => entry.type === 'SMS'));
  */

  let startDate = null;
  let endDate = null;
  try {
    startDate = parseTime(process.env.START_TIME);
    endDate = parseTime(process.env.END_TIME);
  } catch (e) {
    console.warn(e.message);
  }

  try {
    const { subject, date } = parse(TEST_STRING, startDate, endDate);
    writeDB(subject, date);
  } catch (e) {
    console.warn(e.message);
  }
}

run();
