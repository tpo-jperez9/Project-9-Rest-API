// Load modules
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const {asyncHandler} = require('./middleware/asyncHandler');
const {User, Course} = require('./models');
const {authenticateUser} = require('./middleware/authentication');
const auth = require('basic-auth');

// Returns currently authenticated user
router.get('/users', authenticateUser, asyncHandler(async(req, res) => {
  const user = req.currentUser;
  res.json({
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.emailAddress
  });
}));

// Alows creation of a new user and sets location
// header to "/", returning a 201 HTTP status
router.post('/users', asyncHandler(async (req, res) => {
  const user = req.body;
  const errors = [];

  // Validates firstName exists
  if (!user.firstName) {
    errors.push('Please provide a value for "firstName"');
  }

  // Validates lastName exists
  if (!user.lastName) {
    errors.push('Please provide a value for "lastName"');
  }

  // Validates emailAddress exists
  if (!user.emailAddress) {
    errors.push('Please provide a value for "emailAddress"');
  }

  // Validates password exists
  if (!user.password) {
    errors.push('Please provide a value for "password"');
  }

  // If any errors, set status to 400 and send error messages to client
  if (errors.length > 0) {
    // Return the validation errors to the client.
    res.status(400).json({errors});
  } else {
    try {
      // Creates new user, sets Location header, and sets status to 204
      const newUser = await User.create(user);
      res.location('/').status(201).end();
    } catch (error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });   
      } else {
        throw error;
      }
    }

  }
}));

// Returns a list of all courses and their associated users
router.get('/courses', asyncHandler(async (req, res) => {
  const courses = await Course.findAll({
    include: [
      {
        model: User,
        as: 'User',
        attributes: [
          'id',
          'firstName',
          'lastName',
          'emailAddress'
        ]
      }
    ],
    attributes: [
      'id',
      'title',
      'description',
      'estimatedTime',
      'materialsNeeded'
    ]
  });
  res.status(200).json(courses);
}));

// Returns a specific course and its associated user
router.get('/courses/:id', asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id, {
    include: [
      {
        model: User,
        as: 'User',
        attributes: [
          'id',
          'firstName',
          'lastName',
          'emailAddress'
        ]
      }
    ],
    attributes: [
      'id',
      'title',
      'description',
      'estimatedTime',
      'materialsNeeded'
    ]
  });
  res.status(200).json(course);
}));

// Creates new course, sets Location header to URI for
// newly created course, returns 201 status code
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
  const course = req.body;
  const errors = [];

  // Validates title exists
  if (!course.title) {
    errors.push('Please provide a value for "title"');
  }

  // Validates description exists
  if (!course.description) {
    errors.push('Please provide a value for "description"');
  }

  // If any errors, set status to 204 and send error messages to client
  if (errors.length > 0) {
    res.status(400).json({errors});
  } else {
    // Gets id from user and appends it as userId to req.body
    // So that the authenticated user is associated with the course
    const credentials = auth(req);
    const user = await User.findOne({
      where: {
        emailAddress: credentials.name
      }
    });
    const userId = user.id;
    req.body.userId = userId;

    // Creates new course, sets Location header to URI for
    // newly created course, returns 201 status code
    const newCourse = await Course.create(req.body);
    res.location(`/courses/${newCourse.id}`).status(201).end();
  }
}));

// Updates corresponding course and returns 204 status code
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  const course = req.body;
  const errors = [];

  // Validates title exists
  if (!course.title) {
    errors.push('Please provide a value for "title"');
  }

  // Validates description exists
  if (!course.description) {
    errors.push('Please provide a value for "description"');
  }

  // If any errors, set status to 204 and send error messages to client
  if (errors.length > 0) {
    res.status(400).json({errors});
  } else {
    const course = await Course.findByPk(req.params.id);
    const credentials = auth(req);
    const user = await User.findOne({
      where: {
        emailAddress: credentials.name
      }
    });

    // Checks to see if the authenticated user is the creator of the course
    // and if true, updates the course
    if (course.userId === user.id) {
      // Updates corresponding course and returns 204 status code
      await course.update(req.body);
      res.location(`/courses/${req.params.id}`).status(204).end();
    } else {
      res.status(403).json({error: 'Not the correct user'});
    }
  }
}));

// Deletes the corresponding course and returns 204 status code
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  const credentials = auth(req);
  const user = await User.findOne({
    where: {
      emailAddress: credentials.name
    }
  });

  // Checks to see if the authenticated user is the creator of the course
  // and if true, deletes the course
  if (course.userId === user.id) {
    await course.destroy();
    res.status(204).end();
  } else {
    res.status(403).json({error: 'Not the correct user'});
  }
}));

module.exports = router;