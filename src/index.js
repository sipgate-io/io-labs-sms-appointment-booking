import * as dotenv from "dotenv";
import { parseTime } from "./parse.js";
import { handleAllSms } from "./handleSms.js";
import { createHistoryModule, sipgateIO} from 'sipgateio';

dotenv.config();


async function run() {
  const tokenId = process.env.TOKEN_ID;
  const token = process.env.TOKEN;

  const client = sipgateIO({ tokenId, token });
  const historyModule = createHistoryModule(client);
  const historyEntries = await historyModule.fetchAll();
  const response = historyEntries.filter((entry) => entry.type === "SMS" && entry.direction === "INCOMING");

  let startDate = null;
  let endDate = null;
  try {
    startDate = parseTime(process.env.START_TIME);
    endDate = parseTime(process.env.END_TIME);
  } catch (e) {
    console.warn(e.message);
  }

  handleAllSms(response,startDate,endDate, client);
}

run();
