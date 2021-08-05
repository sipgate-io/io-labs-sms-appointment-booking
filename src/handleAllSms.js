import { handleSms } from "./handleSms";

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
