import {PhoneNumberError, SmsParseError,} from "./errors.js";
import {parseDateString, parseTimeString} from "./util/date.js";

export function parse(sms, startDate, endDate, currentDate) {
    if (!isValidE164PhoneNumber(sms.source)) {
        throw new PhoneNumberError(
            `Keine gültige E164 Telefonnummer: ${sms.source}`
        );
    }

    if (!sms.smsContent.includes("Termin")) {
        throw new SmsParseError(
            "Die Eingabe war fehlerhaft, bitte überprüfe deinen Input."
        );
    }

    const {year, month, day} = parseDateString(sms.smsContent);
    const {hour, minute} = parseTimeString(sms.smsContent);

    const subject = sms.smsContent;
    let date;

    if (year) {
        const provisionalDate = new Date(year, month - 1, day, hour, minute);
        if (currentDate > provisionalDate) {
            date = getUpcomingDate(month, day, hour, minute, currentDate);
        } else {
            date = provisionalDate;
        }
    } else {
        date = getUpcomingDate(month, day, hour, minute, currentDate);
    }

    if (date.getDate() !== day) {
        throw new SmsParseError("Sorry, den Tag gibt es in dem Monat nicht.");
    }

    if (date.getMonth() + 1 !== month) {
        throw new SmsParseError("Sorry, den Monat gibt es nicht.");
    }

    if (minute !== 0) {
        throw new SmsParseError("Du kannst nur Termine zur vollen Stunde buchen.");
    }

    if (hour > endDate.hour || hour < startDate.hour) {
        throw new SmsParseError(
            `Du kannst nur zwischen ${String(startDate.hour).padStart(
                2,
                "0"
            )}:${String(startDate.minute).padStart(2, "0")} und ${String(
                endDate.hour
            ).padStart(2, "0")}:${String(endDate.minute).padStart(
                2,
                "0"
            )} einen Termin buchen.`
        );
    }

    return {subject, date};
}

export function getUpcomingDate(month, day, hour, minute, currentDate) {
    const provisionalDate = new Date(
        currentDate.getFullYear(),
        month - 1,
        day,
        hour,
        minute
    );
    if (provisionalDate < currentDate) {
        return new Date(
            currentDate.getFullYear() + 1,
            month - 1,
            day,
            hour,
            minute
        );
    }
    return provisionalDate;
}

function isValidE164PhoneNumber(phoneNumber) {
    const regEx = /^\+[1-9]\d{10,14}$/;
    return regEx.test(phoneNumber);
}
