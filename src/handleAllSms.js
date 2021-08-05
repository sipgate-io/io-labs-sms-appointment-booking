import { handleSms } from "./handleSms.js";

export function handleAllSms(
  response,
  startDate,
  endDate,
  client,
  currentDate
) {
  response.forEach((sms) => {
    handleSms(sms, startDate, endDate, client, currentDate);
  });
}
