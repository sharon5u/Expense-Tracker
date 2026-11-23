# Expense Tracker

## About this app
I built an expense tracker app that allows users to record their daily expenditures and view summary of expenditures. 

## Screens

- My Wallet: This screen has multiple categories where the user can choose to add expenditure in, such as food, entertainment, etc. 
- Calendar: A calendar view of dates in which the user can view their expenditure by clicking onto a specific date
- Profile: Stores user information such as profile picture, profile name, monthly summary. 

## Setup and running

This project uses Expo SDK 58 (`expo ~58.0.25`), React Native 0.88.1,
React 19.3, TypeScript, and Expo Router. Node 22.13 or newer is required by the assignment.
The build environment had Node 26.13.1. The intended demo device is the student's iPhone
using Expo Go; its model and iOS version must be filled in after testing.

```sh
npm install
npx expo start
```

Sign into the same Expo account on the Mac and in Expo Go. Connect both devices to
the same Wi-Fi, then scan the new terminal QR code using the iPhone Camera.
If the local connection fails, try `npx expo start --tunnel`.

Run these commands from the project root containing this README and package.json.
Stop any old Expo server first, or use the different port offered by Expo and scan
the new QR code. The student successfully opened this app on an iPhone using
tunnel mode: `npx expo start --tunnel --port 8082`.

## Surprises
I was surprised about how the agent comprehended my instructions this time. I think this is because mobile apps have a more standard structure for building compared to web apps since there our only this small amount of space to layout the app. I am curious about how the screens and functions are stored differently compared to just having a style.css and a index.html file. 
