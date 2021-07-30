class SmsParseError extends Error {
  constructor(message) {
    super(message);
    this.name = "SmsParseError";
  }
}

class AppointmentTakenError extends Error {
  constructor(message) {
    super(message);
    this.name = "AppointmentTakenError";
  }
}

export { SmsParseError, AppointmentTakenError };
