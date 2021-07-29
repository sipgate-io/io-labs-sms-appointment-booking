import { writeFileSync, readFileSync, existsSync } from "fs";

export function readDB() {
  const buffer = readFileSync("db.json");
  const json = buffer.toString();
  return deserialize(json);
}

export function writeDB(subject, date) {
  const data = serialize(subject, date.toISOString());
  writeFileSync("db.json", data, { flags: "w+" });
}

function serialize(subject, date) {
  const data = {
    subject,
  };

  let json = null;
  if (existsSync("db.json")) {
    const currentData = readDB();

    if (currentData[date] !== undefined) {
      throw Error("Sorry, an appointment at this time is already taken");
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
