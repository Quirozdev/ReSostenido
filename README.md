# ReSostenido

A web app created with Node.js, Express and MySQL

## Setup

To setup the local repository

```
git clone https://github.com/Quirozdev/ReSostenido.git

cd ReSostenido
```

Installing dependencies

```
npm install
```

### Execute the resostenido.sql file for MySQL

Create a .env file that must contains the following variables:

```
HOST_NAME=

MYSQLHOST=
MYSQLPORT=
MYSQLUSER=
MYSQLPASSWORD=
MYSQLDATABASE='resostenido'

SESSION_SECRET=

EMAIL_USER=
EMAIL_USER_PASSWORD=

PAYPAL_CLIENT_ID=
PAYPAL_SECRET=
```

To run the project

```
npm run start
```

To run the project in watch mode

```
npm run dev
```
