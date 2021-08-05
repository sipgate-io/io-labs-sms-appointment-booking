import { writeFileSync, readFileSync, existsSync } from "fs";
import { AppointmentTakenError } from "./errors.js";

export function readDB() {
  const buffer = readFileSync("db.json");
  const json = buffer.toString();
  const result = deserialize(json);
  return result;
}

export function writeDB(subject, date, source) {
  const data = serialize(subject, date.toISOString(), source);
  writeFileSync("db.json", data, { flags: "w+" });
}

function serialize(subject, date, source) {
  const data = {
    subject,
    date,
    source,
  };

  let json = null;
  if (existsSync("db.json")) {
    const currentData = readDB();

    if (currentData[date] !== undefined) {
      throw new AppointmentTakenError(
        "Sorry, zu diesem Zeitpunkt gibt es keinen freien Termin."
      );
    }

    currentData[date] = data;
    json = JSON.stringify(currentData);
  } else {
    json = JSON.stringify({ [date]: data });
  }

  return json;
}

function deserialize(json) {
  const data = JSON.parse(json, (key, value) => {
    if (key === "date") {
      return new Date(value);
    }

    return value;
  });

  return data;
}
