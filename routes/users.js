var express = require('express');
var router = express.Router();
const db = require('../db');
const { User } = db.models;

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

// Send a GET request to /api/user/:id to READ(view) a user by ID
// GET /api/users
// 200 - Returns the currently authenticated user
router.get('/:id', asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if(user) {
      res.json(user);
    } else {
      res.json({message: 'User not found'});
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }  
}));

// Send a POST request to /api/users to CREATE a user
// POST /api/users
// 201 - Creates a user, sets the Location header to "/", and returns no content
router.post('/api/users', asyncHandler(async (req, res, next) => {
  //Save user to db
  let user;
  try {
    user = await User.create(req.body);
    res.redirect('/');
  } catch (error){
    if(error.name === 'SequelizeValidationError') {
      // DO SOMETHING...
    } else {
      next(error);
    } 
  };
}));

module.exports = router;
