# AWS IoT Client App
💻 A simple app for viewing and controlling devices on AWS IoT

[![Build][travis-image]][travis-url]

A client app that displays data from, and allows control of, AWS IoT devices. Uses AWS IoT device shadows for device interaction, and uses Cognito for user authentication.


## Setup

```bash
git clone https://github.com/brendan-myers/aws-iot-client-app.git
cd aws-iot-simulated-device
npm install
```

`config.js` contains the security configuration details for the simulated device. For information on where to download device certificates and details, see [AWS IoT SDK](https://github.com/aws/aws-iot-device-sdk-js).


## Run

To start a live reload development server

```bash
npm run dev
```


## Production Build

```bash
npm run build
```


## Todo

- Tests
- Display historical data
- Better error handling and state management


[travis-image]: https://travis-ci.org/brendan-myers/aws-iot-simulated-device.svg?branch=master
[travis-url]: https://travis-ci.org/brendan-myers/aws-iot-simulated-device