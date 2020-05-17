var express = require('express');
var router = express.Router();
const db = require('../db');
const { User, Course } = db.models;
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');

// Handler function to wrap each route
function asyncHandler(cb){
  return async(req, res, next) => {
    try{
      await cb(req, res, next)
    } catch(error) {
      next(error);
    }
  }
}

const authenticateUser = async(req, res, next) => {
  let message = null;
  // Parse the user's credentials from the Authorization header.
  const credentials = auth(req);

  // If the user's credentials are available...
  if (credentials) {
    // Attempt to retrieve the user from the data store
    // by their username (i.e. the user's "key"
    // from the Authorization header).
    // const user = users.find(u => u.username === credentials.name);
    
    const user = await User.findOne({
      where: {
        emailAddress: credentials.name,
      }
    });

    // If a user was successfully retrieved from the data store...
    if (user) {
      // Use the bcryptjs npm package to compare the user's password
      // (from the Authorization header) to the user's password
      // that was retrieved from the data store.
      const authenticated = bcryptjs
        .compareSync(credentials.pass, user.password);
      // If the passwords match...
      if (authenticated) {
        // Then store the retrieved user object on the request object
        // so any middleware functions that follow this middleware function
        // will have access to the user's information.
        req.currentUser = user;
      } else {
        message = `Authentication failure for username: ${user.username}`;
      }
    } else {
      message = `User not found for username: ${credentials.name}`;
    }
  } else {
    message = 'Auth header not found';
  }
  // If user authentication failed...
  if (message) {
    console.warn(message);
    // Return a response with a 401 Unauthorized HTTP status code.
    res.status(401).json({ message: 'Access Denied' });
  } else {
    // Or if user authentication succeeded...
    // Call the next() method.
    next();
  }
};

// GET /api/users
// 200 - Returns the currently authenticated user
router.get('/', authenticateUser, asyncHandler(async (req, res, next) => {
  try {
    const currentUser = req.currentUser;
    
    const user = await User.findByPk(currentUser.id, {
      attributes: {
          exclude: [
              'password',
              'createdAt',
              'updatedAt'
          ]
      }
    });


    res.json(user);
  } catch (error) {
    res.status(500).json({message: error.message});
  }  
}));

// POST /api/users
// 201 - Creates a user, sets the Location header to "/", and returns no content
router.post('/', asyncHandler(async (req, res, next) => {
  let user;
  try {    
    // Get the user from the request body.
    user = req.body;

    // Hash the new user's password.
    user.password = bcryptjs.hashSync(user.password);

    // Add the user to the db.
    await User.create(user);

    // Set the status to 201 Created and set Header Location '/'.
    res.status(201).location('/').end();
    
  } catch (error){
      next(error);
  };
}));

module.exports = router;
