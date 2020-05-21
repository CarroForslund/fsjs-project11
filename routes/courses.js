const express = require('express');
const router = express.Router();
const db = require('../db');
const { Course, User } = db.models;
const authenticateUser = require('../middleware/authenticate-user');
const asyncHandler = require('../middleware/async-handler');

// GET /api/courses
// 200 - Returns a list of courses (including the user that owns each course)
router.get('/', asyncHandler(async (req, res, next) => {
  const courses = await Course.findAll({
    include: [
      {
        model: User,
        as: 'user',
        attributes: {
          exclude: [
            'password',
            'createdAt',
            'updatedAt'
          ]
        }
      },
    ],
    attributes: {
      exclude: [
        'createdAt',
        'updatedAt'
      ]
    }
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
        attributes: {
          exclude: [
            'password',
            'createdAt',
            'updatedAt'
          ]
        }
      },
    ],
    attributes: {
      exclude: [
        'createdAt',
        'updatedAt'
      ]
    }
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
      if(error.name === 'SequelizeValidationError') {
        res.status(400).json({ message: error.message });;
      }
      next(error);
  };  
}));

// PUT /api/courses/:id
// 204 - Updates a course 
// and returns no content
// FIX THIS PROBLEM!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
router.put('/:id', authenticateUser, asyncHandler(async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if(course) {

      if(course.userId == req.currentUser.id) {

        if(!req.body.title || !req.body.description) {
          res.status(400).json({ message: 'Validation error. Title and description are both required to be able to update this course.'});
        }

        course.title = req.body.title;
        course.description = req.body.description;

        if(req.body.estimatedTime) {
          course.estimatedTime = req.body.estimatedTime;
        } 
        if(req.body.materialsNeeded){
          course.materialsNeeded = req.body.materialsNeeded;
        }
        course.userId = req.currentUser.id;

        await course.update({
          title: course.title,
          description: course.description,
          estimatedTime: course.estimatedTime,
          materialsNeeded: course.materialsNeeded,
        });
        res.status(204).end();

      } else {
        res.status(403).json({ message: "You don't have permission to edit this course." });
      }

    } else {
      res.status(404).json({ message: 'Course not found.' });
    }

  } catch (error) {
    if(error.name === 'SequelizeValidationError') {
      res.status(400).json({ message: error.message });;
    }
    res.status(500).json({ message: error.message });
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
