# Parking Management App

A parking management system with a Node.js/Express backend, MongoDB database and JWT authentication. Users can register, log in, create vehicles and parking sessions, and make payments. Admins can also create parking spaces.

## Requirements

- Node.js 18 or newer
- A MongoDB database (MongoDB Atlas or local)
- Postman (optional, for testing the API)

## Setup

1. Clone the repository:

```
git clone https://github.com/ejimpatrick14-art/Parking-Management-App.git
cd Parking-Management-App/backend
```

2. Install dependencies:

```
npm install
```

3. Create a file named `.env` inside the `backend` folder with these variables:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=any_long_random_text
ADMIN_EMAIL=the_email_that_should_become_admin
```

| Variable | What it does |
| --- | --- |
| PORT | Port the server runs on (5000) |
| MONGO_URI | MongoDB connection string |
| JWT_SECRET | Secret used to sign login tokens |
| ADMIN_EMAIL | Anyone who registers with this email gets the admin role |

Never upload `.env` to GitHub.

4. Start the server:

```
npm run dev
```

You should see "Parking Management API running on http://localhost:5000" and "MongoDB connected successfully".

## API Routes

Base URL: `http://localhost:5000/api`

All routes except register and login need a token. Send it as `Authorization: Bearer <token>`.

### Authentication

| Method | Route | Description |
| --- | --- | --- |
| POST | /auth/register | Create an account |
| POST | /auth/login | Log in and receive a token |

### Vehicles

| Method | Route | Description |
| --- | --- | --- |
| POST | /vehicles | Create a vehicle |
| GET | /vehicles | Get all vehicles |
| GET | /vehicles/:id | Get one vehicle |

### Parking Spaces

| Method | Route | Description |
| --- | --- | --- |
| POST | /parking/spaces | Create a space (admin only) |
| GET | /parking/spaces | Get all spaces |
| GET | /parking/spaces/:id | Get one space |

### Parking Sessions

| Method | Route | Description |
| --- | --- | --- |
| POST | /parking/sessions | Start a session (space becomes occupied) |
| GET | /parking/sessions | Get all sessions |
| GET | /parking/sessions/:id | Get one session |
| PUT | /parking/sessions/:id | Complete a session (space becomes available) |

### Payments

| Method | Route | Description |
| --- | --- | --- |
| POST | /payments | Create a payment for a session |
| GET | /payments | Get all payments |
| GET | /payments/:id | Get one payment |

## Testing with Postman

Import the collection `Parking Management API` and run the requests in this order: Register, Login, Create Vehicle, Create parking space (admin), Create parking session, Complete session, Create payment. IDs and the token are saved automatically between requests.

## Roles

- **user**: default role for new accounts
- **admin**: given to the account that registers with `ADMIN_EMAIL`