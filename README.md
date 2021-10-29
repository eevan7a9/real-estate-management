# real-estate-management

A online property management solution for real estate and
physical property management. This can include residential,
commercial, and land real estate. a software developed to
connect property managers and potential buyers.

both **frontend/** & **backend-fastify/** are work in progress.😕

**[LIVE DEMO](https://real-estate-management.netlify.app/)**

![Screenshot](https://ik.imagekit.io/wr5lnrww0q8/REM_Folder/social_GKmc-8vHw.jpg?updatedAt=1631134174081)


## **Dependencies**

### **Frontend**
- ionic 5+
- Angular 12+
- leaflet 1.7+
- chartjs 3.5+

### **Backend**
- Node
- fastify 3+
- mongoDB

# **SETUP**

## **Frontend (Part)**

navigate to `frontend/` directory.

### **1. Fill the desired environment variables:**  
- navigate to `frontend/src/environments`
- set values to variables (ex. api.url) 

### **2. then install dependencies & run ionic serve**

In terminal - command
```
#  navigate to frontend 
$ cd frontend

# install dependencies
$ npm install

# serve frontend
& ionic serve
```

<br>

## **Backend-Fastify (Part)**
navigate to `backend-fastify/` directory.

### **1. create `.env` file & add variables:**
- copy `.env.example` & re-name it to `.env`
- set your desired variable value

### **2. then install dependencies & run dev**

In terminal - command
```
#  navigate to backend-fastify 
$ cd backend-fastify

# install dependencies
$ npm install

# start server
$ npm start `or` $ npm run dev

```