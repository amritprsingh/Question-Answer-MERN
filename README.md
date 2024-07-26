## MERN QA Project
Welcome to my Question Answer Project using MERN

## Ask Questions About Any Topic
- Questions include titles, descriptions, and links in their content
- Questions can be associated with certain tags
- Questions can be voted upon depending on the quality of the question
- Questions track view count, like totals, and time asked
- Questions can be commented upon 
- Search for any specific question using the search bar
- All this information is visble when clicking on the question from the home Page

## Answer Questions
- Answer any question as per choice
- Answers can be voted upon depending on validity of answer
- Answers can also be commented upon

## Tags
- Tags shows that are associated with each question
- Tags page to see all tags created across site and selecting them shoes the questions related to them
- Tags can be deleted and searched for explicitly

## User Profiles
- Create users and login with cookies to manage how long the user will stay logged on
- User profiles show questions asked, comments and questions answered
- Delete or alter any questions or answer
- Delete tags if no other user has questions associated with that tag

## Admin Profile
- Create one admin profile upon initialization
- Admin can see all users on site
- Admin can delete any user or any of their information (questions, answers, etc.) as needed

## Skills Used
- React for client side
- MongoDB to store questions, answers, tags, and user profiles
- ExpressJS for server side
- NodeJS for development
- CORS for middleware
- BCrypt for password hashing
- Cookie-Parser for cookies maintainence

## Run the Code
- Open a terminal and run: "mongod". Then open another terminal and pull the project code. 
- Once project has been cloned and in the project directory, to set up the database run command of the form:
  node server/init.js mongodb://127.0.0.1:27017/fake_so admin@gmail.com Pass@1234
  - You are running node script at server/ called init.js with mongodb argument to create database fake_so and run default port 27017 with next 2 arguments being admin email and password (you can modify the given email and password to your liking).
- Then, run the server with the command:
  nodemon server/server.js
- Change directory to client/ using "cd client/"
- Now run the front end using the command:
  npm start
