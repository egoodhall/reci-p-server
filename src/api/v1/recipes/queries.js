import _ from 'lodash';

import { connection } from '../../../db';


const buildQuery = ({ filter, limit, page }) => {
  return `
    SELECT r.*,
      GROUP_CONCAT(DISTINCT ingredients.ingredient separator ', ') as ingredients,
      GROUP_CONCAT(DISTINCT instructions.instruction ORDER BY instructions.number separator ', ') as instructions
    FROM recipes r
      LEFT JOIN ingredients ON ingredients.recipe_id = r.id
      LEFT JOIN instructions ON instructions.recipe_id = r.id
    ${ (filter) ? `WHERE ${filter}` : '' }
    GROUP BY r.id ORDER BY modification_ts DESC, creation_ts DESC, id ASC
    ${ (limit && page && page >= 0) ? `LIMIT ${limit} OFFSET ${limit * page}` : '' }
  `;
};


const processRecipe = (recipe) => {
  if (recipe.instructions) {
    recipe.instructions = recipe.instructions.split(', ');
  } else {
    recipe.instructions = [];
  }
  if (recipe.ingredients) {
    recipe.ingredients = recipe.ingredients.split(', ');
  } else {
    recipe.ingredients = [];
  }
  return recipe;
};


const getRecipes = (res, { id }) => {
  const query = buildQuery({
    filter: 'owner = ?'
  });

  // Make query to database
  connection.query(query, [id], (err, result) => {
    res.json({
      success: (err) ? false : true,
      msg: (err) ? err.sqlMessage : undefined,
      data: _.map(JSON.parse(JSON.stringify(result)), processRecipe)
    });
  });
};


const getFeed = (res, uid, { page }) => {
  const query = buildQuery({
    filter: 'owner IN (SELECT producer FROM relations WHERE consumer=?)',
    limit: 10,
    page
  });

  // Make query to database
  connection.query(query, [uid], (err, result) => {
    res.json({
      success: (err) ? false : true,
      msg: (err) ? err.sqlMessage : undefined,
      data: _.map(JSON.parse(JSON.stringify(result)), processRecipe)
    });
  });
};


const getRecipe = (res, id) => {
  let query = buildQuery({
    filter: 'id=?',
    limit: 1
  });

  console.log(query);
  console.log([id]);

  // Make query to database
  connection.query(query, [id], (err, result) => {
    console.log(result);
    res.json({
      success: (err) ? false : true,
      msg: (err) ? err.sqlMessage : undefined,
      data: processRecipe(JSON.parse(JSON.stringify(result[0])))
    });
  });
};


export {
  getRecipes,
  getFeed,
  getRecipe
};
