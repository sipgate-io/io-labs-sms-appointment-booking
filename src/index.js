import * as dotenv from "dotenv";
import { handleAllSms } from "./handleAllSms.js";
import { createHistoryModule, sipgateIO } from "sipgateio";
import {parseWorkingTime} from "./util/environment";

dotenv.config();

export async function run() {
  const tokenId = process.env.TOKEN_ID;
  const token = process.env.TOKEN;

  const client = sipgateIO({ tokenId, token });
  const historyModule = createHistoryModule(client);
  const smsEntries = await historyModule.fetchAll({
    types: ["SMS"],
    directions: ["INCOMING"],
    archived: false,
  });
  let startDate = null;
  let endDate = null;
  try {
    startDate = parseWorkingTime(process.env.START_TIME);
    endDate = parseWorkingTime(process.env.END_TIME);
  } catch (e) {
    console.warn(e.message);
  }
  historyModule.batchUpdateEvents(smsEntries, () => {
    return {
      archived: true,
    };
  });

  const currentDate = new Date();
  handleAllSms(smsEntries, startDate, endDate, client, currentDate);
}
