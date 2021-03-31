REST API for teachers
A REST API created using Node, Express, Sequelize, and Sqlite Allows the creation of courses and users in a Sqlite database. Users can login using basic-auth credentials and create, read, update, or delete courses

Installation
To install dependancies, run npm install

To Run
To run this application, run npm start. The app runs on localhost:5000 or the server env port

Running "npm start" creates the sqlite database
Run npm run seed to seed the database with a few initial entries
Testing
To test the API, download and install Postman and test out the various routes

Routes in use
GET /api/users - Retrieves the currently authenticated user
POST /api/users - Allowes the user to create a login account
GET /api/courses - Retrieves a list of courses from the database
GET /api/courses/:id - Retrieves a specific course and its information
POST /api/courses - Allows a user to create a course which only they will be able to update or delete
PUT /api/courses/:id - Allows the user to update any course they created
DELETE /api/courses/:id - User can delete any course they created
