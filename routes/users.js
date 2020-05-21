const express = require('express');
const router = express.Router();
const db = require('../db');
const { User } = db.models;
const authenticateUser = require('../middleware/authenticate-user');
const asyncHandler = require('../middleware/async-handler');
const bcryptjs = require('bcryptjs');

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
        ],
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
    user = await req.body;

    // Hash the new user's password.
    if(user.password){
      user.password = bcryptjs.hashSync(user.password);
    }
    
    // Add the user to the db.
    await User.create(user);

    // Set the status to 201 Created and set Header Location '/'.
    res.status(201).location('/').end();
    
  } catch (error){
      if(error.name === 'SequelizeValidationError') {
        res.status(400).json({ message: error.message });;
      } else {
        next(error);
      }
  };
}));

module.exports = router;
