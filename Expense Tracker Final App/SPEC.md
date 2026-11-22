# Expense Tracker
## 1. Purpose

Expense Tracker is a phone app that allows users to manually record their expenditures. The app will then categorize these records by type, months, year and also alllow user to view a summary of their cash flow. 
## 2. Scope

### Essential features
- Allows user input of expenditure amount and category
- Data that must survive closing and reopening the app

### Out of scope
Consider potential improvements such as linking to card/bank accounts and tracking expenditures with each card. 

## 3. Screens and navigation

### Screen 1: My Wallet
- Purpose: Default screen as the user open the app. Allows user to click on any category and record expenditure. 
- Displays: The screen should have a switch button at the top indicating which month, the user can click left or right arrow to switch between different months. The main screen should display different categories (with an icon of each) such as food, transportation, shopping, entertainment, medical, etc, and also allow user to add their own category. 
- Actions: When clicking onto each category, user can input their expense amount and a short note about the expense. The category displays the total amount for this category and this months. 
- Navigation: There are navigators at the bottom of the screen, where the user can click and switch between screens. 

### Screen 2: Calendar
- Purpose: Screen 2 is a calendar which shows the monthly calendar where the user can click on any date to edit/add expenditure. 
- Displays: The screen should display a monthly calendar and highlight the current date. There should be a summary at the bottom for this months including the top 5 category expenditure by amount, as well as the total expenditure this months. 
- Actions: User can click onto each date and add/edit expenditure and then save changes. All changes should be preserved after editing and reentering the screen. 
- Navigation: There are navigators at the bottom of the screen, where the user can click and switch between screens. 

### Screen 3: Profile
- Purpose: Profile screen shows the user's personal information. 
- Displays: Profile picture, profile username, line chart showing past monthly expenditures. 
- Actions: User can edit profile picture, profile username, profile theme (dark/bright), and adjust time frame to view line chart for a specific time period. 
- Navigation: There are navigators at the bottom of the screen, where the user can click and switch between screens. 

## 5. Design

- Colors: Mainly black for dark theme, mainly white for bright theme. 
- Layout: Beginner friendly layout. 
- Text and spacing: Normal font size, use bold/highlight for titles and important information. 
- Only Number keyboard should pop up when entering amount. Normal letter keyboard pop up when entering note/changing text based information. 

## 6. Numbered Acceptance Criteria
1. The app opens on My Wallet. Bottom navigation allows users to switch between My Wallet, Calendar, and Profile.

2. My Wallet displays the selected month and year. Month arrows update the displayed month and its category totals, including across year boundaries.

3. Tapping a category opens a form for an amount, date, and optional note. Saving a valid expense updates that category’s monthly total. Canceling makes no changes.

4. Amount fields use a numeric keyboard. Empty, zero, negative, nonnumeric amounts, or amounts with more than two decimal places are rejected with a clear error message.

5. Users can create a category with a nonempty, unique name. It appears in My Wallet and can be used to record expenses.

6. alendar shows the correct dates for the selected month and highlights today. Selecting a date allows users to add or edit expenses for that date. Saving an edit updates the existing expense without duplicating it.

7. Calendar displays the month’s total spending and its five highest-spending categories, or fewer if fewer have expenses. Months without expenses show a zero total and an empty-state message.

8. Users can update their profile picture and username and switch between dark and bright themes. The selected theme applies to all three screens.

9. Profile displays a line chart of monthly spending for a user-selected time range. Months without expenses show zero, and an invalid time range displays an error.

10. Expenses, categories, profile information, and theme remain after completely closing and reopening the app. If saving fails, the app displays an error and preserves the input for retry.