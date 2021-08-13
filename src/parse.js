import {
    SmsParseError,
    PhoneNumberError,
} from "./errors.js";

function parseDateString(string) {
    const dayWithWrittenMonthAndYearRegex = /\b(?<day>\d{1,2})(\.|te([rn]))?( ){0,4}(?<writtenMonth>jan(\.|uar)?|feb(\.|ruar)?|m(ä|a|ae)r([.z])?|apr(\.|il)?|mai|jun([.i])?|jul([.yi])?|aug(\.|ust)?|sep(\.|t(\.|ember)?)?|okt(\.|ober)?|nov(\.|ember)?|dez(\.|ember)?)( ){0,4}(?<year>\d{2,4})\b/i;
    const dayWithWrittenMonthWithoutYearRegex = /\b(?<day>\d{1,2})(\.|te([rn]))?( ){0,4}(?<writtenMonth>jan(\.|uar)?|feb(\.|ruar)?|m(ä|a|ae)r([.z])?|apr(\.|il)?|mai|jun([.i])?|jul([.yi])?|aug(\.|ust)?|sep(\.|t(\.|ember)?)?|okt(\.|ober)?|nov(\.|ember)?|dez(\.|ember)?)\b/i;
    const dayWithNumericMonthAndYearRegex = /\b(?<day>\d{1,2})(\.|te([rn])| )( ){0,4}(?<numericMonth>\d{1,2})([. ])( ){0,4}(?<year>\d{2,4})\b/;
    const dayWithNumericMonthWithoutYearRegex = /\b(?<day>\d{1,2})(\.|te([rn])| )( ){0,4}(?<numericMonth>\d{1,2})\b/;

    switch (true) {
        case dayWithWrittenMonthAndYearRegex.test(string): {
            const matchingGroups = dayWithWrittenMonthAndYearRegex.exec(string).groups;
            return {
                year: matchingGroups.year,
                month: matchingGroups.writtenMonth,
                day: matchingGroups.day,
            };
        }
        case dayWithWrittenMonthWithoutYearRegex.test(string): {
            const matchingGroups = dayWithWrittenMonthWithoutYearRegex.exec(string).groups;
            return {
                year: undefined,
                month: matchingGroups.writtenMonth,
                day: matchingGroups.day,
            };
        }
        case dayWithNumericMonthAndYearRegex.test(string): {
            const matchingGroups = dayWithNumericMonthAndYearRegex.exec(string).groups;
            return {
                year: matchingGroups.year,
                month: matchingGroups.numericMonth,
                day: matchingGroups.day,
            };
        }
        case dayWithNumericMonthWithoutYearRegex.test(string): {
            const matchingGroups = dayWithNumericMonthWithoutYearRegex.exec(string).groups;
            return {
                year: undefined,
                month: matchingGroups.numericMonth,
                day: matchingGroups.day,
            };
        }
        default:
            throw new SmsParseError(
                "Die Eingabe war fehlerhaft, bitte überprüfe deinen Input."
            );
    }
}

export function parseTimeString(string) {
    const spelledOutTimeRegex = /\b(?<hour>\d{1,2})( )?Uhr\b/i;
    const numericalTimeRegex = /\b(?<hour>\d{1,2}):(?<minute>\d{2})\b/i;
    switch (true) {
        case numericalTimeRegex.test(string): {
            const matchingGroups = numericalTimeRegex.exec(string).groups;
            return {
                hour: matchingGroups.hour,
                minute: matchingGroups.minute,
            }
        }
        case spelledOutTimeRegex.test(string): {
            const matchingGroups = spelledOutTimeRegex.exec(string).groups;
            return {
                hour: matchingGroups.hour,
                minute: 0,
            }
        }
        default:
            throw new SmsParseError(
                "Die Eingabe war fehlerhaft, bitte überprüfe deinen Input."
            );
    }
}

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
    console.log(year, month, day);

    const {hour, minute} = parseTimeString(sms.smsContent);
    console.log(hour, minute);

    const subject = sms.smsContent;
    let date;

    if (year) {
        const provisionalDate = new Date(year, month - 1, day, hour, minute);
        if (currentDate > provisionalDate) {
            date = getUpcoming(month, day, hour, minute, currentDate);
        } else {
            date = provisionalDate;
        }
    } else {
        date = getUpcoming(month, day, hour, minute, currentDate);
    }

    if (!isValidDate(date)) {
        throw new SmsParseError(
            "Das Datum des Termins ist falsch formatiert, bitte überprüfe deinen Input."
        );
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

export function getUpcoming(month, day, hour, minute, currentDate) {
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

export function parseTime(timeString) {
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

function isValidDate(date) {
    return date.getTime() === date.getTime();
}

function isValidE164PhoneNumber(phoneNumber) {
    const regEx = /^\+[1-9]\d{10,14}$/;
    return regEx.test(phoneNumber);
}
