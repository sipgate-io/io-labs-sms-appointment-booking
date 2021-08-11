# io-labs-sms-appointment-booking
A simple Node.js application for booking appointments via SMS.

## What is sipgate.io?

[sipgate.io](https://www.sipgate.io/) is a collection of APIs, which enables sipgate's customers to build flexible integrations matching their individual needs.
Among other things, it provides interfaces for sending and receiving text messages or faxes, monitoring the call history, as well as initiating and manipulating calls.
In this tutorial, we will use sipgate.io's contact API to import contacts from your company's Microsoft Outlook address book.

## In this example

The script in this repository pulls the most recent SMS and tries to create an appointment by parsing the content.
The SMS text content should be sent in the following format:</br>
</br>
```Termin: [Date], [Time], [Subject]```</br>
```Termin: 13.12, 15:00, Zahnarzttermin```</br>
</br>
If no year is specified we assume that the appointment should be booked in the upcoming date in the future (e.g. 14.02 booked in july 2021 is 14.02.2022, 30.10 booked in july 2021 is 30.10.2021).
Otherwise we try to parse the given year.

In every case you will receive an answer sms, which can contain the following messages:
- Appointment is booked successfully
- Appointment is taken
- Appointment is not in the working hours
- SMS content is not in the right format
- Appointment can not be booked at the full hour

The working hours are defined in an env file.</br>
For example:
```START_HOUR=9:00```
```END_HOUR=16:00```

All appointments are saved to a local file, which is named `db.json`.


**Prerequisite:** You need `npm` and Node.js installed on your machine.

## Getting started

To be able to launch this example, navigate to a directory where you want the example service to be stored. In a terminal, you can clone this repository from GitHub and install all required dependencies using `npm install`.

```bash
git clone https://github.com/sipgate-io/io-labs-sms-appointment-booking
cd io-labs-sms-appointment-booking
npm install
```

## Execution

Make sure to set the credentials of your sipgate account (token and token ID.
See [Personal Access Token documentation](https://www.sipgate.io/rest-api/authentication#personalAccessToken) on sipgate.io) either in a `.env` file or by providing them as temporary environment variables at program execution:

```bash
SIPGATE_TOKEN=<token> \
SIPGATE_TOKEN_ID=<tokenId> \
START_HOUR=<time>\
END_HOUR=<time>
```

## Start and test the project
To start the project you can use the following command:
`npm start`

The tests can be executed by `npm test`
