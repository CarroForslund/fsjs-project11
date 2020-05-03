var express = require('express');
var router = express.Router();
const db = require('../db');
const { Course, User } = db.models;

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
    res.status(200).json(course);
  } else {
    res.status(404).json({message: 'Course not found'});
  }
  
}));

// Send a POST request to /api/courses to CREATE a course
// POST /api/courses
// 201 - Creates a course, 
// sets the Location header to the URI for the course, 
// and returns no content
router.post('/api/courses', asyncHandler(async (req, res, next) => {
  //Save user to db
  let user;
  try {
    course = await Courses.create(req.body);
    res.status(201).redirect('/' + course.id);
  } catch (error){
    if(error.name === 'SequelizeValidationError') {
        // DO SOMETHING...
    } else {
        next(error);
    } 
  };
}));

// PUT /api/courses/:id
// 204 - Updates a course 
// and returns no content
router.put('/:id', asyncHandler(async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if(course) {
      course.title = req.body.title;
      course.description = req.body.description;
      course.estimatedTime = req.body.estimatedTime;
      course.materialsNeeded = req.body.materialsNeeded;
      course.userId = req.body.userId;

      res.status(204).end;
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
router.delete('/:id', asyncHandler(async (req, res, next) => {
  // DO SOMETHING...
}));

module.exports = router;
