# 🛒 Grocery Budget

This is a tiny, client-side web app for managing your spend at the supermarket. It's all well and good to have an idea of how much you want
to spend when you go grocery shopping, but how do you keep an accurate tally when your trolley is full of groceries?

## Usage

Start by specifying your total budget for this shopping trip.

Add items like a to-do list, putting the name/description in the main text field.

Add a quantity for each item, e.g., "3 x Tomato tins".

Leave the unit price blank until you take the item off the shelf at the store, at which point the whole item line will read something like
"3 x Tomato tins @ $1.50 ea. = $1.50" (the total price for the item is calculated for you at the end of the line.

When editing an item, press the 'ea/' button to switch that item into '/kg' pricing, which allows you to specificy a quantity in grams and a
price per kilogram. Use this mode for fresh fruit and vegetables, for example.

As you specify item prices, the item will go gray, indicating it has been added with remaining items in bold.

At the top of the list you will see a running total of your entire shopping trolley, as well as the amount you have still available to spend
(green), or how much you have exceeded your budget (red).

If you need to remove an item, select it to enter edit mode, and press the trash can _twice_.

## Technical details

This is a minimal web app that **only runs in modern browsers that support ES6, including modules**. It does _not_ use a module bundler like
Webpack, and the only Javascript dependency is [React](https://reactjs.org/), which is included as a `script` tag in the HTML.

Babel is used, only to transpile JSX.

The [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) API is used to persist your list data across browser
sessions/tabs. This is a purely client-side web app, so there is no server component, or way to sync lists between devices.
