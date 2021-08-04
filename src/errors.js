class SmsParseError extends Error {
  constructor(message) {
    super(message);
    this.name = "SmsParseError";
  }
}

class PhoneNumberError extends Error {
  constructor(message) {
    super(message);
    this.name = "PhoneNumberError";
  }
}

class AppointmentTakenError extends Error {
  constructor(message) {
    super(message);
    this.name = "AppointmentTakenError";
  }
}

export { SmsParseError, AppointmentTakenError, PhoneNumberError };
