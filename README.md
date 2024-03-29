# io-labs-sms-appointment-booking
A simple Node.js application for booking appointments via SMS.

## What is sipgate.io?

[sipgate.io](https://www.sipgate.io/) is a collection of APIs, which enables sipgate's customers to build flexible integrations matching their individual needs.
Among other things, it provides interfaces for sending and receiving text messages or faxes, monitoring the call history, as well as initiating and manipulating calls.

## In this example

This project implements a basic SMS appointment booking service
using the sipgate.io REST-API.

## Getting started

**Prerequisite:** You need `npm` and Node.js installed on your machine.
To be able to launch this example, navigate to a directory where you want the example service to be stored. In a terminal, you can clone this repository from GitHub and install all required dependencies using `npm install`.

```bash
git clone https://github.com/sipgate-io/io-labs-sms-appointment-booking
cd io-labs-sms-appointment-booking
npm install
```

## Environment

Make sure to set the credentials of your sipgate account (token and token ID.
See [Personal Access Token documentation](https://www.sipgate.io/rest-api/authentication#personalAccessToken) on sipgate.io) either in a `.env` file or by providing them as temporary environment variables at program execution:

```bash
SIPGATE_TOKEN=<token>
SIPGATE_TOKEN_ID=<tokenId>
START_TIME=<time>
END_TIME=<time>
```
The Personal Access Token needs the following scopes:
```
    history:read
    history:write
    sessions:sms:write
```
## Quickstart
To start the project you can use the following command:

`npm start`

This script repeats every 5 minutes.

## Under the hood

The script in this repository pulls the most recent SMS and tries to create an appointment by parsing the content.
The SMS text content can be sent in multiple formats, for example:

```
Termin: [Date], [Time], [Subject]
Termin: 13.12, 15:00, Zahnarzttermin
```
or in whole sentences:

```
Ich möchte einen Termin am 13.12 um 15:00 Uhr zum Haare schneiden.

Ich hätte gerne einen Termin am 2 Dezember um 14 Uhr buchen zum Haare schneiden.

Ich brauche einen Termin am 2ten Dez um 14 Uhr buchen zum Haare schneiden.

Ich brauche am 12.09.2022 einen Termin zum Haare schneiden um 14:00 Uhr.
```

If no year is specified or the given date is in the past,
we assume that the appointment should be booked in the upcoming date in the future

- 14.02 booked in July 2021 is 14.02.2022
- 14.02.1980 booked in July 2021 is 14.02.2022
- 28.10 booked in July 2021 is 28.10.2021
- 28.10.1980 booked in July 2021 is 28.10.2021

Otherwise, we try to parse the given year in the future.

In every case you will receive an answer SMS, which can contain the following messages:

- Appointment is booked successfully
- Appointment is taken
- SMS content is not in the right format
- Appointment can not be booked at the full hour
- Appointment is not in the working hours

The working hours are defined in the `.env` file, e.g:

```
START_TIME=9:00
END_TIME=16:00
```

All appointments are saved to a local `db.json` file.

## Tests

The tests can be executed via

`npm test`