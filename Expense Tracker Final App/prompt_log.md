Tools to build: Codex


- ok, build the app according to my spec. Read SPEC.md in this project. Implement the full mobile app exactly as specified. This is an Expo project using Expo Router, so screens belong in src/app/. Check package.json for the exact Expo SDK version and write code for that version. Create all necessary files, components, and navigation. Make sure that appropriate data is persistent. Avoid security risks for sensitive data.  Include proper error handling. Make sure the app starts without errors and displays the home screen correctly.
- Explain to me what each file means
- Your app has three main parts: screens you see, code that manages and saves expenses, and documents explaining the project. Here’s a guide to the files in your [final app folder](/Users/sharon.wu/Documents/Codex/2026-11-21/referenced-chatgpt-conversation-this-is-an/outputs/Expense Tracker Final App).

The files that create your screens

A .tsx file contains TypeScript code that can also describe what appears on screen.
File	What it does
[index.tsx](/Users/sharon.wu/Documents/Codex/2026-11-21/referenced-chatgpt-conversation-this-is-an/outputs/Expense Tracker Final App/src/app/index.tsx)	Creates My Wallet: month arrows, monthly total, category cards, and adding categories.
[calendar.tsx](/Users/sharon.wu/Documents/Codex/2026-11-21/referenced-chatgpt-conversation-this-is-an/outputs/Expense Tracker Final App/src/app/calendar.tsx)	Creates Calendar: dates, daily expenses, editing entries, and the top-five monthly summary.
[profile.tsx](/Users/sharon.wu/Documents/Codex/2026-11-21/referenced-chatgpt-conversation-this-is-an/outputs/Expense Tracker Final App/src/app/profile.tsx)	Creates Profile: username, photo, theme switch, and spending chart.
[_layout.tsx](/Users/sharon.wu/Documents/Codex/2026-11-21/referenced-chatgpt-conversation-this-is-an/outputs/Expense Tracker Final App/src/app/_layout.tsx)	Sets up the bottom tabs and connects every screen to the same saved data. Shows a loading indicator while records load.


Shared interface pieces

A component is a reusable piece of the interface, such as a button or form.
File	What it does
[expense-form.tsx](/Users/sharon.wu/Documents/Codex/2026-11-21/referenced-chatgpt-conversation-this-is-an/outputs/Expense Tracker Final App/src/components/tracker/expense-form.tsx)	The form used to add and edit expenses. Collects amount, date, category, and note; checks the inputs; handles Save and Cancel.
[ui.tsx](/Users/sharon.wu/Documents/Codex/2026-11-21/referenced-chatgpt-conversation-this-is-an/outputs/Expense Tracker Final App/src/components/tracker/ui.tsx)	Defines the shared buttons, text fields, cards, page layout, month arrows, and pop-up forms. This keeps the screens visually consistent.


The files that manage your information
File	What it does
[model.ts](/Users/sharon.wu/Documents/Codex/2026-11-21/referenced-chatgpt-conversation-this-is-an/outputs/Expense Tracker Final App/src/lib/model.ts)	Defines what an expense/category/profile contains. Checks amounts and dates, calculates totals, and formats money.
[store.tsx](/Users/sharon.wu/Documents/Codex/2026-11-21/referenced-chatgpt-conversation-this-is-an/outputs/Expense Tracker Final App/src/lib/store.tsx)	Keeps the current data shared between screens. Coordinates loading and saving, prevents overlapping saves, and supplies the light/dark color palettes.
[storage.ts](/Users/sharon.wu/Documents/Codex/2026-11-21/referenced-chatgpt-conversation-this-is-an/outputs/Expense Tracker Final App/src/lib/storage.ts)	Saves records to the phone and reads them when the app reopens. Writes new snapshots instead of overwriting the previous saved file. The web version uses browser storage.


For example, saving a $12.50 food expense works like this:
1. The expense form collects your input.
2. The model checks it and converts $12.50 to 1,250 cents, avoiding decimal rounding problems.
3. The shared store asks storage to save the updated records.
4. After saving succeeds, the screens receive the new data and their totals update.
Your assignment documents
File	What it means
[SPEC.md](/Users/sharon.wu/Documents/Codex/2026-11-21/referenced-chatgpt-conversation-this-is-an/outputs/Expense Tracker Final App/SPEC.md)	Your plan: what the app should do and the acceptance criteria it must meet.
[REVIEW.md](/Users/sharon.wu/Documents/Codex/2026-11-21/referenced-chatgpt-conversation-this-is-an/outputs/Expense Tracker Final App/REVIEW.md)	The fresh agent’s original assessment of the raw build. Keep it unchanged.
[README.md](/Users/sharon.wu/Documents/Codex/2026-11-21/referenced-chatgpt-conversation-this-is-an/outputs/Expense Tracker Final App/README.md)	The project’s introduction and instructions for running it. Includes sections you must write yourself.
[TESTING.md](/Users/sharon.wu/Documents/Codex/2026-11-21/referenced-chatgpt-conversation-this-is-an/outputs/Expense Tracker Final App/TESTING.md)	Records automated checks, review fixes, and your phone-testing results.
[prompt_log.md](/Users/sharon.wu/Documents/Codex/2026-11-21/referenced-chatgpt-conversation-this-is-an/outputs/Expense Tracker Final App/prompt_log.md)	Records actual AI prompts and relevant interventions.


.md means Markdown, a plain-text format with simple formatting for titles, lists, and tables.

Project settings and tools
File	What it does
[package.json](/Users/sharon.wu/Documents/Codex/2026-11-21/referenced-chatgpt-conversation-this-is-an/outputs/Expense Tracker Final App/package.json)	Lists the software libraries the app needs and commands such as start, lint, and test.
[package-lock.json](/Users/sharon.wu/Documents/Codex/2026-11-21/referenced-chatgpt-conversation-this-is-an/outputs/Expense Tracker Final App/package-lock.json)	Records the exact installed library versions so another installation can reproduce them.
[app.json](/Users/sharon.wu/Documents/Codex/2026-11-21/referenced-chatgpt-conversation-this-is-an/outputs/Expense Tracker Final App/app.json)	Expo settings: app name, icons, portrait orientation, splash screen, and platform options.
[tsconfig.json](/Users/sharon.wu/Documents/Codex/2026-11-21/referenced-chatgpt-conversation-this-is-an/outputs/Expense Tracker Final App/tsconfig.json)	Settings for TypeScript’s code checks and import shortcuts.
[eslint.config.js](/Users/sharon.wu/Documents/Codex/2026-11-21/referenced-chatgpt-conversation-this-is-an/outputs/Expense Tracker Final App/eslint.config.js)	Rules used to flag coding mistakes and problematic patterns.
[.gitignore](/Users/sharon.wu/Documents/Codex/2026-11-21/referenced-chatgpt-conversation-this-is-an/outputs/Expense Tracker Final App/.gitignore)	Tells Git which generated or local files to leave out of commits.
[AGENTS.md](/Users/sharon.wu/Documents/Codex/2026-11-21/referenced-chatgpt-conversation-this-is-an/outputs/Expense Tracker Final App/AGENTS.md)	Instructions for AI coding agents working on this project. It doesn’t run inside the app.
[LICENSE](/Users/sharon.wu/Documents/Codex/2026-11-21/referenced-chatgpt-conversation-this-is-an/outputs/Expense Tracker Final App/LICENSE)	The software’s licensing terms.


Tests and editor settings
- [model.test.cjs](/Users/sharon.wu/Documents/Codex/2026-11-21/referenced-chatgpt-conversation-this-is-an/outputs/Expense Tracker Final App/tests/model.test.cjs) checks amounts, dates, month changes, and saved-data validation.
- [storage.test.cjs](/Users/sharon.wu/Documents/Codex/2026-11-21/referenced-chatgpt-conversation-this-is-an/outputs/Expense Tracker Final App/tests/storage.test.cjs) uses a simulated file system to check saving, reopening, and failure handling. It doesn’t replace phone testing.
- [.vscode/settings.json](/Users/sharon.wu/Documents/Codex/2026-11-21/referenced-chatgpt-conversation-this-is-an/outputs/Expense Tracker Final App/.vscode/settings.json) configures editor actions when saving.
- [.vscode/extensions.json](/Users/sharon.wu/Documents/Codex/2026-11-21/referenced-chatgpt-conversation-this-is-an/outputs/Expense Tracker Final App/.vscode/extensions.json) recommends the Expo extension.
- [.claude/settings.json](/Users/sharon.wu/Documents/Codex/2026-11-21/referenced-chatgpt-conversation-this-is-an/outputs/Expense Tracker Final App/.claude/settings.json) enables an Expo plugin for Claude Code.
Images and remaining starter files

The [assets folder](/Users/sharon.wu/Documents/Codex/2026-11-21/referenced-chatgpt-conversation-this-is-an/outputs/Expense Tracker Final App/assets) contains app icons, splash-screen artwork, browser icons, and leftover Expo demo images. Names containing @2x or @3x are higher-resolution versions for sharper displays.

Some original starter helpers remain in the [components](/Users/sharon.wu/Documents/Codex/2026-11-21/referenced-chatgpt-conversation-this-is-an/outputs/Expense Tracker Final App/src/components) folder:
- animated-icon files: starter-logo animations; the CSS file styles the web animation.
- themed-text and themed-view: starter text/container components.
- external-link: opens external websites.
- hint-row: displays a starter instruction row.
- web-badge: displays Expo branding.
- ui/collapsible: an expandable section.
The [hooks folder](/Users/sharon.wu/Documents/Codex/2026-11-21/referenced-chatgpt-conversation-this-is-an/outputs/Expense Tracker Final App/src/hooks) and [theme.ts](/Users/sharon.wu/Documents/Codex/2026-11-21/referenced-chatgpt-conversation-this-is-an/outputs/Expense Tracker Final App/src/constants/theme.ts) support those starter components. Your expense tracker’s current pastel colors come from useColors() in store.tsx.

Finally, [reset-project.js](/Users/sharon.wu/Documents/Codex/2026-11-21/referenced-chatgpt-conversation-this-is-an/outputs/Expense Tracker Final App/scripts/reset-project.js) resets the project to a blank starter. Don’t run it on your finished app.

- What is a hook here?
- A hook is a special React function that lets a component do things such as remember information or load saved data. Hook names start with use.

In your expense form, you have:
const [amount, setAmount] = useState('');
Here:
- useState('') starts the amount as empty text.
- amount holds the current value, such as "12.50".
- setAmount changes that value when the user types.
When setAmount runs, React updates the screen to reflect the new value.

Your app also uses:
- useEffect to begin loading saved expenses when the app opens.
- useStore, a custom hook we created, to let different screens access the same expenses and profile.
- useColors, another custom hook, to choose the colors for the selected theme.
Using useState alone does not save data permanently. Your storage code handles keeping expenses after the app closes.
- what about use State?
- useState lets a component remember a value and update the screen when that value changes.

Your expense form uses:
const [amount, setAmount] = useState('');
This creates two things:
- amount — the current text in the amount field.
- setAmount — the function used to change that text.
The '' means the starting value is an empty string, so the field starts blank.

When you type 12.50, the input calls:
setAmount('12.50');
React remembers the new value and runs the component again to display it. This is called re-rendering.

Use setAmount(...) to update the value rather than assigning directly to amount.

It only remembers the value while that component remains active. Saving the expense permanently requires your separate storage code.
- OK, where is this function used, in which screens
- useState is used on all three screens, plus the shared expense form:
Screen/file	What it remembers
My Wallet — index.tsx	Selected month, selected category, whether the new-category form is open, the category name being typed, and errors.
Calendar — calendar.tsx	Selected month, selected date, and which expense form is open.
Profile — profile.tsx	Username and photo being edited, chart date range, error messages, and photo-selection status.
Expense form — expense-form.tsx	Amount, note, date, selected category, and errors. This form opens from both My Wallet and Calendar.


The specific example we discussed—
const [amount, setAmount] = useState('');
—is the simplified version of the amount state in expense-form.tsx. In the actual code, the starting value is blank for a new expense or the existing amount when editing one.
