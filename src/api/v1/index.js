import { Router } from 'express';

import { createUser, follow, unfollow } from './users/mutations';
import { userSearch, getUser, getFollowing } from './users/queries';

import { createRecipe, deleteRecipe } from './recipes/mutations';
import { getRecipes, getRecipe, getFeed } from './recipes/queries';

const v1 = new Router();

//======//
// USER //
//======//

// Create a user
v1.post('/users', (req, res) => {
  createUser(res, req.body);
});

// Retrieve
v1.get('/users/:id', (req, res) => {
  const { id } = req.params;
  getUser(res, id);
});

// Search for users with a key
v1.get('/users/search/:query', (req, res) => {
  userSearch(res, req.params.query, req.query);
});

// Follow
v1.post('/users/:follower/follow/:target', (req, res) => {
  const { follower, target } = req.params;
  follow(res, follower, target);
});

// Unfollow
v1.delete('/users/:follower/follow/:target', (req, res) => {
  const { follower, target } = req.params;
  unfollow(res, follower, target);
});

// Retrieve a user's recipes
v1.get('/users/:id/recipes', (req, res) => {
  const { id } = req.params;
  getRecipes(res, { id });
});

// Retrieve the users followed by a specified user
v1.get('/users/:id/following', (req, res) => {
  const { id } = req.params;
  getFollowing(res, { id }, req.query);
});

// Retrieve feed
v1.get('/users/:id/feed', (req, res) => {
  const { id } = req.params;
  getFeed(res, id, req.query);
});

//=========//
// RECIPES //
//=========//

// Create
v1.post('/recipes', (req, res) => {
  createRecipe(res, req.body);
});

// Retreive
v1.get('/recipes/:id', (req, res) => {
  const { id } = req.params;
  console.log(id);
  getRecipe(res, id);
});

// Delete
v1.delete('/recipes/:id', (req, res) => {
  const { id } = req.params;
  deleteRecipe(res, id);
});

export default v1;
