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
SECRET_KEY='secret'
DB_CONNECT=mongodb://localhost:27017/rem-db
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
## Routes
```
/docs/
/users/
/auth/
/properties/
/enquiries/
```