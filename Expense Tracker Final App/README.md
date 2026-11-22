# Expense Tracker

## About this app — student writing required

[Write 1–2 sentences yourself describing the app and why you chose it.]

## Screens — student writing required

- My Wallet: [Describe this screen and its actions in your own words.]
- Calendar: [Describe this screen and its actions in your own words.]
- Profile: [Describe this screen and its actions in your own words.]

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

### Implementation choices

- Currency is USD. Amounts are stored as integer cents to avoid decimal rounding errors.
- Dates are entered as YYYY-MM-DD; accepted years are 1900–2199.
- Valid amounts range from $0.01 to $9,999,999.99.
- A new Wallet expense defaults to today in the current month, or the first day
  of another selected month. Users can change the date.
- Calendar has its own month selector. Tabs retain their own selected month.
- Profile changes require Save profile; the theme toggle saves immediately.
- Native data is stored in the app's local documents folder through Expo FileSystem.
  A validated temporary file is moved to a new revision filename; the previous snapshot is never overwritten. Three revisions are retained. The web preview uses
  browser localStorage. Native and browser data are separate.
- Profile photos are copied into the app's documents folder so they survive cache cleanup.
- No bank integration, remote backend, analytics, account credentials, or API keys.
  Local records are not encrypted; do not enter account numbers or passwords.

### Verification status

Eight automated tests passed after review fixes. Four cover amounts, calendar dates, month navigation/chart ranges, and saved-data validation. Four use a simulated file system to check repeated saves/reopening, failed writes/renames with retry, cleanup failure, and corrupt committed data. These are not real-device persistence tests.

The student installed the required packages in the delivered copy. TypeScript and
ESLint now pass, and an iOS JavaScript bundle was generated successfully. The lockfile
has been updated. The student confirmed that the app opens on their iPhone using tunnel mode.
Photo selection, force-close persistence, and the remaining acceptance-criterion
results have not yet been reported.
The attempted browser preview could not connect because its local server did not start.

To repeat the automated checks, run:

```sh
npm test
npx tsc --noEmit
npm run lint
npx expo export --platform ios
```

Then manually test all 10 SPEC.md criteria on your iPhone, especially saving a second
expense, editing it, and reopening Expo Go after force-closing it. Test invalid
amounts, leap dates, month/year boundaries, duplicate categories, themes, photo
selection/cancel, and an invalid chart range. Record the results in TESTING.md.

## Device used

[Fill in your iPhone model, iOS version, and Expo Go version after testing.]

## What surprised me — student writing required

[Write this reflection yourself. Do not submit an AI-written reflection.]

## Review follow-up

See REVIEW.md for the independent review as originally produced. See TESTING.md for
review follow-up and verification limits.

## Submission checklist

- [ ] Fill in the student-written sections above.
- [ ] Verify every acceptance criterion on the phone and record honest results.
- [ ] Read REVIEW.md and address or explain its findings.
- [ ] Preserve the raw build commit and subsequent review-fix commits.
- [ ] Add any missing actual prompts to prompt_log.md, verbatim.
- [ ] Push the complete project, SPEC.md, REVIEW.md, README.md, and prompt log to GitHub.
- [ ] Record a 1–2 minute video showing all screens, input, and persistence after restart.
- [ ] Upload the video with permissions that let course staff watch it.
- [ ] Add a repository link, your brief description, and a phone screenshot to your portfolio.
- [ ] Submit repository/video links and required information in the assignment's Google form.

## Suggested demo timing (guidance, not a recorded video)

- 0:00–0:15: Introduce your app in your own words; show My Wallet and month navigation.
- 0:15–0:40: Add an expense with a note and date; show the new category total.
- 0:40–1:00: Open Calendar, edit the expense, and show the monthly summary.
- 1:00–1:20: Show Profile, theme switching, and the spending chart.
- 1:20–1:50: Force-close Expo Go, reopen the project, and show the saved record remains.

Assignment: https://www.cs.cmu.edu/~113/hw10.html
Submission form: https://forms.gle/rzAwetD6EBXSbEfo7
