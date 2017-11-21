import _ from 'lodash';

import { connection } from '../../../db';


const queryBase = `
SELECT r.*,
  GROUP_CONCAT(DISTINCT ingredients.ingredient separator ', ') as ingredients,
  GROUP_CONCAT(DISTINCT instructions.number, '. ', instructions.instruction ORDER BY instructions.number separator ', ') as instructions
FROM recipes r
  LEFT JOIN ingredients ON ingredients.recipe_id = r.id
  LEFT JOIN instructions ON instructions.recipe_id = r.id
`;


const queryEnd = `
GROUP BY r.id ORDER BY modification_ts DESC, creation_ts DESC, id ASC
`;


const processRecipe = (recipe) => {
  if (recipe.instructions) {
    recipe.instructions = recipe.instructions.split(', ');
  }
  if (recipe.ingredients) {
    recipe.ingredients = recipe.ingredients.split(', ');
  }
  return recipe;
};


const getRecipes = (res, filters) => {
  let queryParams = [];
  let query = queryBase;

  if (_.has(filters, 'feed')) {
    query += 'WHERE owner IN (SELECT producer FROM relations WHERE consumer=?)';
    queryParams += filters.feed;
  } else if (_.has(filters, 'id')) {
    query += 'WHERE owner=?';
    queryParams += filters.id;
  }
  query += queryEnd;

  // Make query to database
  connection.query(query, queryParams, (err, result) => {
    res.json({
      success: (err) ? false : true,
      msg: (err) ? err.sqlMessage : undefined,
      data: _.map(result, processRecipe)
    });
  });
};


const getRecipe = (res, id) => {
  let query = queryBase + 'WHERE id=? LIMIT 1' + queryEnd;
  connection.query(query, [id], (err, result) => {
    res.json({
      success: (err) ? false : true,
      msg: (err) ? err.sqlMessage : undefined,
      data: processRecipe(result)
    });
  });
};


export {
  getRecipes,
  getRecipe
};
