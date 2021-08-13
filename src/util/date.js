import {SmsParseError} from "../errors";

const months = {
    1: /jan(\.|uar)?/i,
    2: /feb(\.|ruar)?/i,
    3: /m(ä|a|ae)r([.z])?/i,
    4: /apr(\.|il)?/i,
    5: /ma[iy]/i,
    6: /jun([.i])?/i,
    7: /jul([.yi])?/i,
    8: /aug(\.|ust)?/i,
    9: /sep(\.|t(\.|ember)?)?/i,
    10: /okt(\.|ober)?/i,
    11: /nov(\.|ember)?/i,
    12: /dez(\.|ember)?/i,
}

function parseMonth(monthString) {
    for (const month of Object.keys(months)) {
        if (months[month].test(monthString)) {
            return month;
        }
    }
    throw new SmsParseError(
        "Die Eingabe war fehlerhaft, bitte überprüfe deinen Input."
    );
}

export function parseDateString(string) {
    const dayWithWrittenMonthAndYearRegex = /\b(?<day>\d{1,2})(\.|te([rn]))?( ){0,4}(?<writtenMonth>jan(\.|uar)?|feb(\.|ruar)?|m(ä|a|ae)r([.z])?|apr(\.|il)?|mai|jun([.i])?|jul([.yi])?|aug(\.|ust)?|sep(\.|t(\.|ember)?)?|okt(\.|ober)?|nov(\.|ember)?|dez(\.|ember)?)( ){0,4}(?<year>\d{2,4})\b/i;
    const dayWithWrittenMonthWithoutYearRegex = /\b(?<day>\d{1,2})(\.|te([rn]))?( ){0,4}(?<writtenMonth>jan(\.|uar)?|feb(\.|ruar)?|m(ä|a|ae)r([.z])?|apr(\.|il)?|mai|jun([.i])?|jul([.yi])?|aug(\.|ust)?|sep(\.|t(\.|ember)?)?|okt(\.|ober)?|nov(\.|ember)?|dez(\.|ember)?)\b/i;
    const dayWithNumericMonthAndYearRegex = /\b(?<day>\d{1,2})(\.|te([rn])| )( ){0,4}(?<numericMonth>\d{1,2})([. ])( ){0,4}(?<year>\d{2,4})\b/;
    const dayWithNumericMonthWithoutYearRegex = /\b(?<day>\d{1,2})(\.|te([rn])| )( ){0,4}(?<numericMonth>\d{1,2})\b/;

    let date;
    switch (true) {
        case dayWithWrittenMonthAndYearRegex.test(string): {
            const matchingGroups = dayWithWrittenMonthAndYearRegex.exec(string).groups;
            date = {
                year: parseInt(matchingGroups.year),
                month: parseMonth(matchingGroups.writtenMonth),
                day: matchingGroups.day,
            };
            break;
        }
        case dayWithWrittenMonthWithoutYearRegex.test(string): {
            const matchingGroups = dayWithWrittenMonthWithoutYearRegex.exec(string).groups;
            date = {
                year: undefined,
                month: parseMonth(matchingGroups.writtenMonth),
                day: matchingGroups.day,
            };
            break;
        }
        case dayWithNumericMonthAndYearRegex.test(string): {
            const matchingGroups = dayWithNumericMonthAndYearRegex.exec(string).groups;
            date = {
                year: matchingGroups.year,
                month: matchingGroups.numericMonth,
                day: matchingGroups.day,
            };
            break;
        }
        case dayWithNumericMonthWithoutYearRegex.test(string): {
            const matchingGroups = dayWithNumericMonthWithoutYearRegex.exec(string).groups;
            date = {
                year: undefined,
                month: matchingGroups.numericMonth,
                day: matchingGroups.day,
            };
            break;
        }
        default:
            throw new SmsParseError(
                "Die Eingabe war fehlerhaft, bitte überprüfe deinen Input."
            );
    }
    Object.keys(date).forEach(key => {
        date[key] = parseInt(date[key]);
    })
    return date;
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

