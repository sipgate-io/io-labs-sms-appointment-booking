import { createHistoryModule, sipgateIO } from 'sipgateio';
import * as dotenv from 'dotenv';
dotenv.config();

const TEST_STRING = "Termin: 01.08, 13:00, Haare schneiden";

async function run() {
    /*
    const tokenId = process.env.TOKEN_ID;
    const token = process.env.TOKEN;
    const client = sipgateIO({ tokenId, token });
    const historyModule = createHistoryModule(client);
    const historyEntries = await historyModule.fetchAll();
    console.log(historyEntries.filter(entry => entry.type === 'SMS'));
    */
   parseSms(TEST_STRING);
}

function parseSms(smsText) {
    // remove 'Termin: '
    const s = smsText.slice(8, smsText.length);
    // split by comma
    let tokens = s.split(",");
    tokens = tokens.map(token => token.trim());
    const date = parseInt(tokens[0].split(".")[0]);
    const month = parseInt(tokens[0].split(".")[1]);
    console.log(date);
    console.log(month);
}

run();