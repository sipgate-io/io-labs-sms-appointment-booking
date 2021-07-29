import { createHistoryModule, sipgateIO } from "sipgateio";
import * as dotenv from "dotenv";
import { writeDB } from "./db.js";
dotenv.config();

const TEST_STRING = "Termin: 30.02, 11:00, Treffen im Park";

async function run() {
  /*
    const tokenId = process.env.TOKEN_ID;
    const token = process.env.TOKEN;
    const client = sipgateIO({ tokenId, token });
    const historyModule = createHistoryModule(client);
    const historyEntries = await historyModule.fetchAll();
    console.log(historyEntries.filter(entry => entry.type === 'SMS'));
    */

  try {
    const { subject, date } = parse(TEST_STRING);
    writeDB(subject, date);
  } catch (e) {
    console.warn(e.message);
  }
}

function parse(smsBody) {
  const s = smsBody.slice(8, smsBody.length);
  let tokens = s.split(",");
  tokens = tokens.map((token) => token.trim());
  const day = parseInt(tokens[0].split(".")[0]);
  const month = parseInt(tokens[0].split(".")[1]);
  const hour = parseInt(tokens[1].split(":")[0]);
  const minute = parseInt(tokens[1].split(":")[1]);
  const date = new Date(2021, month - 1, day, hour, minute);

  if (!isValidDate(date)) {
    throw Error(
      "The input for the date could not be parsed, please check your input."
    );
  }

  if (date.getDate() !== day) {
    throw Error("Sorry, invalid day in month.");
  }

  if (date.getMonth() !== month) {
    throw Error("Sorry, invalid month.");
  }

  if (minute !== 0) {
    throw Error("You can only book an appointment every hour.");
  }

  if (hour > 15 || hour < 8) {
    throw Error(
      "You can only book an appointment between 8:00 AM and 3:00 PM."
    );
  }

  return { subject: tokens[2], date: date };
}

function isValidDate(date) {
  return date.getTime() === date.getTime();
}

run();
