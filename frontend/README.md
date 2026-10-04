# ParkEase Frontend

React + Vite frontend for the Parking Management App (user/driver side and admin dashboard).

> The app name "ParkEase" comes from the project guide's suggestion and may change if the team picks another name.

## Run it

~~~
cd frontend
npm install
npm run dev
~~~

Then open http://localhost:5173. To check the production build, run `npm run build`.

## Pages

| Route | Page | Who can open it |
|---|---|---|
| `/` | Home | Everyone |
| `/login`, `/register` | Login and register | Everyone |
| `/dashboard` | Parking space grid, current session with live fee | Logged-in users |
| `/park` | Vehicle form for a chosen space | Logged-in users |
| `/exit-summary` | End parking, payment and receipt | Logged-in users |
| `/history` | Past sessions and payments | Logged-in users |
| `/admin` | Overview: space counts, revenue, parked vehicles, latest payments | Admins |
| `/admin/spaces` | Add, update status and delete parking spaces | Admins |
| `/admin/records` | All parking records and payments, with search | Admins |

## Current status: mock data

The backend is not connected yet. All data is mocked and kept in the browser, so each browser has its own data.

- **API calls:** every backend call goes through `src/services/api.js`. `USE_MOCK` is `true`, and the real endpoints are written there for when it is switched to `false`.
- **Places marked `TEMPORARY`:** the comments in `Login.jsx`, `Register.jsx`, `Park.jsx`, `ExitSummary.jsx`, `History.jsx`, `AdminOverview.jsx` and `AdminRecords.jsx` show where localStorage must be replaced with real API calls.
- **Login:** no password is checked. Any email and password gets in.
- **Admin role:** any email containing the word `admin` (for example `admin@parkease.com`) is treated as an admin. This is a stand-in until the real auth API returns roles.
- **Fee rule:** placeholder of 500 for the first hour and 300 for each extra hour, rounded up. It is in `calculateFee` in `src/services/api.js` and must be confirmed by the team.
- **Payment:** simulated. Choosing a method and confirming marks the session as paid.

## Folder structure

~~~
src/
  components/   Navbar, AdminRoute (blocks non-admins)
  pages/        one file per page
  services/     api.js (all backend calls)
~~~