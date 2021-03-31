// Load modules
const auth = require('basic-auth');
const bcrypt = require('bcryptjs');
const {User} = require('../models');

// Middleware to authenticate the request using Basic Authentication.
exports.authenticateUser = async (req, res, next) => {
  let message; // Stores the message to present to user
  // Parse the user's credentials from the Authorization header.
  const credentials = auth(req);

  // Checks to see if there are credentials parced from the header
  if (credentials) {
    // Finds a user in the database which matches credentials
    const user = await User.findOne({
      where: {
        emailAddress: credentials.name
      }
    });
    if (user) {
      const authenticated = bcrypt
        .compareSync(credentials.pass, user.password);
      if (authenticated) { // If passwords match
        // Store the user on the request object
        req.currentUser = user;
      } else {
        message = `Authentication failure for username: ${credentials.name}`
      }
    } else {
      message = `User not found for username: ${credentials.name}`;
    }
  } else {
    message = 'Auth header not found';
  }

  if (message) {
    console.warn(message);
    res.status(401).json({message: 'Access Denied'});
  } else {
    console.log(credentials.name);
    next();
  } 
}