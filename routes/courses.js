var express = require('express');
var router = express.Router();
const db = require('../db');
const { Course, User } = db.models;
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

// GET /api/courses
// 200 - Returns a list of courses (including the user that owns each course)
router.get('/', asyncHandler(async (req, res, next) => {
  const courses = await Course.findAll({
    include: [
      {
        model: User,
        as: 'user',
      },
    ],
  });
  res.status(200).json(courses);
}));

// Send a GET request to /api/courses/:id to READ(view) a course by ID
// GET /api/courses/:id 
// 200 - Returns a the course (including the user that owns the course) for the provided course ID
router.get('/:id', asyncHandler(async (req, res, next) => {
  const course = await Course.findByPk(req.params.id, {
    include: [
      {
        model: User,
        as: 'user',
      },
    ],
  });
  if(course) {
    res.status(200).json({
      "title": course.title,
      "description": course.description,
      "estimatedTime": course.estimatedTime,
      "materialsNeeded": course.materialsNeeded
    });
  } else {
    res.status(404).json({message: 'Course not found'});
  }
  
}));

// Send a POST request to /api/courses to CREATE a course
// POST /api/courses
// 201 - Creates a course, 
// sets the Location header to the URI for the course, 
// and returns no content
router.post('/', authenticateUser, asyncHandler(async (req, res, next) => {
  //Save course to db
  let course;
  try {
    course = await Course.create({
      title: req.body.title,
      description: req.body.description,
      estimatedTime: req.body.estimatedTime,
      materialsNeeded: req.body.materialsNeeded,
      userId: req.currentUser.id,
    });

    res.status(201).location('/api/courses/' + course.id).end();
  } catch (error){
      next(error);
  };
}));

// PUT /api/courses/:id
// 204 - Updates a course 
// and returns no content
router.put('/:id', authenticateUser, asyncHandler(async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if(course) {

      if(course.userId == req.currentUser.id) {

        course.title = req.body.title;
        course.description = req.body.description;
        course.estimatedTime = req.body.estimatedTime;
        course.materialsNeeded = req.body.materialsNeeded;
        course.userId = req.currentUser.id;

        course.save();

      } else {
        res.status(403).json({message: "You don't have permission to update this course."});
      }
      res.status(204).end();
    } else {
      res.status(404).json({message: 'Course not found.'});
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}));

// DELETE /api/courses/:id 
// 204 - Deletes a course 
// and returns no content
router.delete('/:id', authenticateUser, asyncHandler(async (req, res, next) => {
  const course = await Course.findByPk(req.params.id);
    if(course) {
      if(course.userId == req.currentUser.id) {
        course.destroy();
        res.status(204).end();
      } else {
        res.status(403).json({message: "You don't have permission to delete this course."});
      }
    }
}));

module.exports = router;
