#!/usr/bin/env node
import { run } from "../src/run.js";

const FIVE_MINUTES_IN_MILLISECONDS = 5 * 60 * 1000;

let interval;

process.on("SIGINT", () => {
  console.log("...Exiting program.");
  clearInterval(interval);
});

console.log("Starting sipgate.io appointment booking service...");
run();
interval = setInterval(() => {
  run();
}, FIVE_MINUTES_IN_MILLISECONDS);
