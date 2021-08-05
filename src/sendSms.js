import { createSMSModule } from "sipgateio";

var currentdate = new Date();
var datetime =
  currentdate.getDate() +
  "/" +
  (currentdate.getMonth() + 1) +
  "/" +
  currentdate.getFullYear() +
  " @ " +
  currentdate.getHours() +
  ":" +
  currentdate.getMinutes() +
  ":" +
  currentdate.getSeconds();

export async function sendSms(message, client, target) {
  const smsModule = createSMSModule(client);

  smsModule.send({
    smsId: process.env.SMS_ID,
    to: target,
    message: message,
    datetime,
  });

  console.log(`SMS gesendet an ${target}: ${message}`);
}
