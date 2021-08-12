import {
    SmsParseError,
    AppointmentTakenError,
    PhoneNumberError,
} from "./errors.js";

function parseDateString(dateString) {
    // 13. Oktober
    // 2dez
    // 04 Mar
    // 14ter Juni
    // 31.12.
    // 31 dezember2024
    // 31.12.14
    // 31 12 2015

    const dayOrMonthRegex = /\d{1,4}/g;
    const matchResult = dateString.match(dayOrMonthRegex);
    const day = parseInt(matchResult[0]);

    let month, year;

    if (matchResult.length === 1) {
        switch (true) {
            case /jan(\.|uar)?/i.test(dateString):
                month = 1; break;
            case /feb(\.|ruar)?/i.test(dateString):
                month = 2; break;
            case /m(a|ä|ae)r(\.|z)?/i.test(dateString):
                month = 3; break;
            case /apr(\.|il)?/i.test(dateString):
                month = 4; break;
            case /mai\.?/i.test(dateString):
                month = 5; break;
            case /jun(\.|i)?/i.test(dateString):
                month = 6; break;
            case /jul(\.|y|i)?/i.test(dateString):
                month = 7; break;
            case /aug(\.|ust)?/i.test(dateString):
                month = 8; break;
            case /sep(\.|t(\.|ember)?)?/i.test(dateString):
                month = 9; break;
            case /okt(\.|ober)?/i.test(dateString):
                month = 10; break;
            case /nov(\.|ember)?/i.test(dateString):
                month = 11; break;
            case /dez(\.|ember)?/i.test(dateString):
                month = 12; break;
            default:
                throw new SmsParseError(
                    "Die Eingabe war fehlerhaft, bitte überprüfe deinen Input."
                );
        }
    } else if (matchResult.length === 2) {
        year = parseInt(matchResult[1]);
        switch (true) {
            case /jan(\.|uar)?/i.test(dateString):
                month = 1; break;
            case /feb(\.|ruar)?/i.test(dateString):
                month = 2; break;
            case /m(a|ä|ae)r(\.|z)?/i.test(dateString):
                month = 3; break;
            case /apr(\.|il)?/i.test(dateString):
                month = 4; break;
            case /mai\.?/i.test(dateString):
                month = 5; break;
            case /jun(\.|i)?/i.test(dateString):
                month = 6; break;
            case /jul(\.|y|i)?/i.test(dateString):
                month = 7; break;
            case /aug(\.|ust)?/i.test(dateString):
                month = 8; break;
            case /sep(\.|t(\.|ember)?)?/i.test(dateString):
                month = 9; break;
            case /okt(\.|ober)?/i.test(dateString):
                month = 10; break;
            case /nov(\.|ember)?/i.test(dateString):
                month = 11; break;
            case /dez(\.|ember)?/i.test(dateString):
                month = 12; break;
            default:
                month = parseInt(matchResult[1]);
                year = undefined;
        }
    } else {
        month = parseInt(matchResult[1]);
        if (matchResult[2].length === 2) {
            year = parseInt("20" + matchResult[2]);
        } else if (matchResult[2].length === 4) {
            year = parseInt(matchResult[2]);
        } else {
            throw new SmsParseError(
                "Die Eingabe war fehlerhaft, bitte überprüfe deinen Input."
            );
        }
    }
    if (!month) {
        throw new SmsParseError(
            "Die Eingabe war fehlerhaft, bitte überprüfe deinen Input."
        );
    }
    return { year, month, day };
}

export function parse(sms, startDate, endDate, currentDate) {
    if (!isValidE164PhoneNumber(sms.source)) {
        throw new PhoneNumberError(
            `Keine gültige E164 Telefonnummer: ${sms.source}`
        );
    }

    if(!sms.smsContent.includes("Termin")) {
        throw new SmsParseError(
            "Die Eingabe war fehlerhaft, bitte überprüfe deinen Input."
        );
    }

    const dateRegex = /(?=(\d{1,2}))\1(\.|te(r|n))?( )?((jan(\.|uar)?|feb(\.|ruar)?|m(ä|a|ae)r(\.|z)?|apr(\.|il)?|mai|jun(\.|i)?|jul(\.|y|i)?|aug(\.|ust)?|sep(\.|t(\.|ember)?)?|okt(\.|ober)?|nov(\.|ember)?|dez(\.|ember)?)|\d{1,2}\.?)( )?(\d{2,4})?/gi;
    const matchResult = sms.smsContent.match(dateRegex);
    if (!matchResult) {
        throw new SmsParseError(
            "Die Eingabe war fehlerhaft, bitte überprüfe deinen Input."
        );
    }
    const dateString = matchResult[0];
    const { year, month, day } = parseDateString(dateString);

    console.log(year, month, day);

    // let tokens = sms.smsContent
    // 	.split(/Termin:|,/)
    // 	.filter((token) => token !== "")
    // 	.map((token) => token.trim());
    //
    // if (tokens.length != 3) {
    // 	throw new SmsParseError(
    // 		"Die Eingabe war fehlerhaft, bitte überprüfe deinen Input."
    // 	);
    // }
    //
    // const { day, month, year } = parseDate(tokens[0]);
    // const { hour, minute } = parseTime(tokens[1]);
    // const subject = tokens[2];
    // let date;
    //
    // if (year) {
    // 	const provisionalDate = new Date(year, month - 1, day, hour, minute);
    // 	if (currentDate > provisionalDate) {
    // 		date = getUpcoming(month, day, hour, minute, currentDate);
    // 	} else {
    // 		date = provisionalDate;
    // 	}
    // } else {
    // 	date = getUpcoming(month, day, hour, minute, currentDate);
    // }
    //
    // if (!isValidDate(date)) {
    // 	throw new SmsParseError(
    // 		"Das Datum des Termins ist falsch formatiert, bitte überprüfe deinen Input."
    // 	);
    // }
    //
    // if (date.getDate() !== day) {
    // 	throw new SmsParseError("Sorry, den Tag gibt es in dem Monat nicht.");
    // }
    //
    // if (date.getMonth() + 1 !== month) {
    // 	throw new SmsParseError("Sorry, den Monat gibt es nicht.");
    // }
    //
    // if (minute !== 0) {
    // 	throw new SmsParseError("Du kannst nur Termine zur vollen Stunde buchen.");
    // }
    //
    // if (hour > endDate.hour || hour < startDate.hour) {
    // 	throw new SmsParseError(
    // 		`Du kannst nur zwischen ${String(startDate.hour).padStart(
    // 			2,
    // 			"0"
    // 		)}:${String(startDate.minute).padStart(2, "0")} und ${String(
    // 			endDate.hour
    // 		).padStart(2, "0")}:${String(endDate.minute).padStart(
    // 			2,
    // 			"0"
    // 		)} einen Termin buchen.`
    // 	);
    // }

    // return { subject, date };
    return {subject: "test", date: new Date(2021, month -1 , day, 14,0)};
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

export function parseDate(dateString) {
    const day = parseInt(dateString.split(".")[0]);
    const month = parseInt(dateString.split(".")[1]);
    const year =
        dateString.split(".").length == 3
            ? parseInt(dateString.split(".")[2])
            : undefined;

    return {month, day, year};
}

function isValidDate(date) {
    return date.getTime() === date.getTime();
}

function isValidE164PhoneNumber(phoneNumber) {
    const regEx = /^\+[1-9]\d{10,14}$/;
    return regEx.test(phoneNumber);
}
