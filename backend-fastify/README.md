# **Backend-Fastify (Part)**

## **1.1 navigate to `backend-fastify/` directory.**

```
cd backend-fastify/
```

## **1.2 create `.env` file & add variables:**

- copy `.env.example` & re-name it to `.env`
- set your desired variable value

```
PORT=8000

LOGGER=true

SALT=12

# Generate with: openssl rand -base64 48
SECRET_KEY='replace-with-a-unique-secret-of-at-least-32-characters'

JWT_EXPIRES_IN='15m'
REFRESH_TOKEN_EXPIRES_IN='14d'
FRONTEND_ORIGINS='https://app.example.com'

DB_CONNECT=mongodb://localhost:27017/rem-db

# Required only when enabling POST /auth/google
GOOGLE_AUTH_CLIENT_ID='your-google-web-client-id.apps.googleusercontent.com'
```

## **2. then install dependencies & run dev**

In terminal - command

```
#  navigate to backend-fastify
$ cd backend-fastify

# install dependencies
$ npm install

# start server
$ npm start `or` $ npm run dev

```

## **2.1 Database seeder(optional)**

- Make sure `.env` is configured & dependencies are installed
- Will populate database with dummy data.

⚠️ This will delete existing records in the database document.

⚠️ Make a backup if needed

```
$ npm run db:seeder
```

dummy user:

```
  fullName: "test tester",
  email: "test@email.com",
  password: "password"

  You can use this to signin.
```

## Authentication sessions

Access tokens expire after 15 minutes. Login, registration, and Google sign-in also set an `HttpOnly` refresh-token cookie. Send requests with credentials enabled, call `POST /auth/refresh` to obtain a replacement access token, and call `POST /auth/logout` to revoke the current device session. Configure `FRONTEND_ORIGINS` with the HTTPS frontend origin in production.

## Routes

```
/docs/
/users/
/auth/
/properties/
/enquiries/
/contact-submissions/
```

Contact submission topics: `general`, `property`, `account`, `technical`, `other`.
