import {SmsParseError} from "../errors";

export function parseWorkingTime(timeString) {
    const hour = parseInt(timeString.split(":")[0]);
    const minute = parseInt(timeString.split(":")[1]);

    if (hour > 23 || hour < 0) {
        throw new SmsParseError(
            "Sorry, die Stunden sind außerhalb des gültigen Bereichs, die Stundenanzahl muss zwischen 0 und 23 Stunden liegen."
        );
    }

    if (minute > 59 || minute < 0) {
        throw new SmsParseError(
            "Sorry, die Minuten sind außerhalb des gültigen Bereichs, der gültige Bereich der Minuten liegt zwischen 0 und 59."
        );
    }

    return {hour, minute};
}