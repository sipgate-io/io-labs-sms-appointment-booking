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
  const smsEntries = await historyModule.fetchAll({types:["SMS"], directions:["INCOMING"], archived: false });
  let startDate = null;
  let endDate = null;
  try {
    startDate = parseTime(process.env.START_TIME);
    endDate = parseTime(process.env.END_TIME);
  } catch (e) {
    console.warn(e.message);
  }
  historyModule.batchUpdateEvents(smsEntries, () => {
   return {
    archived: true
    }
  })
  handleAllSms(smsEntries,startDate,endDate, client);
}

run();
