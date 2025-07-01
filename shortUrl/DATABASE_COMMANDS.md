# MongoDB Commands to Check Users

## Method 1: Using MongoDB Shell (mongo)
1. Open command prompt/terminal
2. Type: mongo
3. Switch to your database: use Short
4. View all users: db.users.find()
5. Count users: db.users.count()
6. View users in readable format: db.users.find().pretty()

## Method 2: Using MongoDB Compass (GUI)
1. Open MongoDB Compass
2. Connect to: mongodb://127.0.0.1:27017
3. Click on "Short" database
4. Click on "users" collection
5. You'll see all registered users

## Method 3: Using Mongoose in Node.js Console
1. In your project folder, run: node
2. Type these commands:
   const mongoose = require('mongoose');
   mongoose.connect('mongodb://127.0.0.1:27017/Short');
   const User = require('./models/user');
   User.find().then(users => console.log(users));

## Collections in Your Database:
- urls: Contains shortened URLs
- users: Contains user registrations

## Sample Queries:
- Show all users: db.users.find()
- Show users without passwords: db.users.find({}, {password: 0})
- Count total users: db.users.countDocuments()
- Show latest users: db.users.find().sort({createdAt: -1}).limit(10)
- Find user by email: db.users.findOne({email: "user@example.com"})
