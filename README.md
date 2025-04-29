# Minimal Nav

## Idea

Show turn by turn navigation info on a small OLEd device using Google Maps on the phone.
The phone and OLED device communicates over BLE and React-Native servers as a bridge.

## Tech Stack used

- Bare React-Native app without Expo to run navigation from point A to point B. The app uses [Google Navigation SDK](https://www.npmjs.com/package/@googlemaps/react-native-navigation-sdk)
- The React native app also connects to BLE device and broadcasts summarized turn by turn info to BLE device.
- The BLE device can be any ESP32 device which supports BLE. In future the device can have small OLED display to show summarized navigation info with icons.

## How to get this app working for you

The app is not published to any store yet and has to be complied and run locally

1. Put the Google SDK API key inside AppDelegate.mn file. Follow Google's SDK instructions to generate one.

2. Install dependencies

   `npm install`

3. Start the App

   `npx react-native run-ios  # or run-android`

You might need OS specific configs to run on your device/emulator. Check React-Native's guide for that.
