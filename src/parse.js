export function parse(smsBody, startDate, endDate) {
  let tokens = smsBody
    .split(/Termin:|,/)
    .filter((token) => token !== "")
    .map((token) => token.trim());
  const { day, month } = parseDate(tokens[0]);
  const { hour, minute } = parseTime(tokens[1]);
  const subject = tokens[2];
  const date = new Date(2021, month - 1, day, hour, minute);

  if (!isValidDate(date)) {
    throw Error(
      "The input for the date could not be parsed, please check your input."
    );
  }

  if (date.getDate() !== day) {
    throw Error("Sorry, invalid day in month.");
  }

  if (date.getMonth() + 1 !== month) {
    throw Error("Sorry, invalid month.");
  }

  if (minute !== 0) {
    throw Error("You can only book an appointment every hour.");
  }

  if (hour > endDate.hour || hour < startDate.hour) {
    throw Error(
      `You can only book an appointment between ${String(
        startDate.hour
      ).padStart(2, "0")}:${String(startDate.minute).padStart(
        2,
        "0"
      )} and ${String(endDate.hour).padStart(2, "0")}:${String(
        endDate.minute
      ).padStart(2, "0")}`
    );
  }

  return { subject, date };
}

export function parseTime(timeString) {
  const hour = parseInt(timeString.split(":")[0]);
  const minute = parseInt(timeString.split(":")[1]);

  if (hour > 23 || hour < 0) {
    throw Error(
      "Sorry, your hours are out of bound, hours have to be between 0 and 23"
    );
  }

  if (minute > 59 || minute < 0) {
    throw Error(
      "Sorry, your minutes are out of bound, minutes have to be between 0 and 59"
    );
  }

  return { hour, minute };
}

function parseDate(dateString) {
  const day = parseInt(dateString.split(".")[0]);
  const month = parseInt(dateString.split(".")[1]);

  return { month, day };
}

function isValidDate(date) {
  return date.getTime() === date.getTime();
}
