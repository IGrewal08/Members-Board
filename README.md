# Member Boards
This is a private, anonymous community message board application. Users can sign up, log in, and create posts with password hashing. A core feature is the implementation of user roles and membership levels which dictate access to certain data and moderation abilities. Posts are anonymous to general members, revealing the poster's identity only to users with the 'Membership' status or higher.

![](public/preview_message.png)
![](public/preview_main.png)

## Technologies
* Node.js v22.14
* PostgreSql 17.6
* pg 8.16
* Express.js 5.1
* ejs 3.1
* Passport.js v0.7
* bcrypt.js v3.0

## Installation and Setup
### Install dependencies
``` 
npm install
```

### Create a Postgres Database
```
psql -U postgres
CREATE DATABASE database_name;
```

### Seeding Database
```
npm populate.config.js
```

### Run this project
http://localhost:[3000] or any port in a env file using PORT=####
```
npm run build
```
