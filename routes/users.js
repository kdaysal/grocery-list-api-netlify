/* global require, module */ //this prevents eslint from marking any undefined vars as errors

const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Get all users
// to test with Postman, run a GET call on url: http://localhost:3000/users
router.get('/', async (req, res) => { // here the '/' is actually my '/users' route due to: <app.use('/users', usersRouter)> in my server.js file;

  //res.send('Hello World from my /users route'); //only needed for testing, delete eventually

  try {
    const users = await User.find();
    res.json(users);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

// Get one user (note - this calls the middleware function 'getUser' first to ensure a valid user is found)
router.get('/:id', getUser, async (req, res) => {
  //res.send(`fetching details for user id: ${req.params.id}`);
  res.json(res.user); // the 'getUser' middleware function has already passed in all of the details for the user (IF it completed successfully)
})

// Create one user
router.post('/', async (req, res) => {
  const user = new User({
    name: req.body.name,
    groceryListItems: req.body.groceryListItems
  })

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message })
  }

})

// Update one user
router.patch('/:id', getUser, async (req, res) => {
  //if the user's name is not null, update it
  if (req.body.name != null) {
    res.user.name = req.body.name;
  }

  //if the groceryListItems array is not null, update it
  if (req.body.groceryListItems != null) {
    res.user.groceryListItems = req.body.groceryListItems;
  }

  /* Retaining the below code as a reminder of the structure I can use in case I decide to make this route more granular than simply replacing the entire existing 'user' with the new data being passed in.*/

  //test1
  //test2

  /* 
  //if the aisle is not null, update it
  if (req.body.groceryListItems[0].aisle != null) {
    res.user.groceryListItems[0].aisle = req.body.groceryListItems[0].aisle;
  }

  //if the reminder is not null, update it
  if (req.body.groceryListItems[0].reminder != null) {
    res.user.groceryListItems[0].reminder = req.body.groceryListItems[0].reminder;
  }
  */

  try {
    const updatedUser = await res.user.save();
    res.status(201).json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message })
  }

})

// Delete one user
router.delete('/:id', getUser, async (req, res) => {
  try {
    await res.user.remove();
    res.json({ message: `User ${req.params.id} was successfully removed` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

// MIDDLEWARE function to get a user by their _id. This function will be called at the beginning of most of my other routes, so this cuts down on repetitive code
async function getUser(req, res, next) {
  let user; //default user to undefined
  try {
    user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Unable to find user' }); // I'm calling 'return' here because if the user was not found, I want to exit out of this method (and not set res.user = user)
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  // code below will only run IF a user was successfully found...
  res.user = user; // creates a new variable 'user' within the response object and sets it to the user that was found in the db
  next(); // move on to the next piece of middleware, or the actual request itself
}

module.exports = router;