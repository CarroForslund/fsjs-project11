var express = require('express');
var router = express.Router();
const db = require('../db');
const { User, Course } = db.models;
const bcryptjs = require('bcryptjs');

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

// GET /api/users
// 200 - Returns the currently authenticated user
router.get('/', asyncHandler(async (req, res, next) => {
  try {
    // TODO ...
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
    if(error.name === 'SequelizeValidationError') {
      // DO SOMETHING...
      
    } else {
      next(error);
    } 
  };
}));

module.exports = router;
