import { multiConnection, connection } from '../../../db';

import _ from 'lodash';

const createQuery = `
INSERT INTO recipes (id, owner, creator, title, prep_time, cook_time, description, photo, creation_ts, modification_ts, rating)
VALUES
  (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
`;

const updateQuery = `
UPDATE recipes SET
  owner=?, title=?, prep_time=?, cook_time=?, description=?, photo=?, modification_ts=?, rating=?
WHERE id=?;
`;

let deleteQuery = `
DELETE FROM recipes WHERE id=?;
`;

let deleteInstQuery = `
DELETE FROM instructions WHERE recipe_id=?;
`;

let deleteIngrQuery = `
DELETE FROM ingredients WHERE recipe_id=?;
`;

const updateIngrAndInst = (recipeId, args, ingredients, instructions) => {
  const ingrData = _.join(_.map(ingredients, (ingredient) => {
    args.push(recipeId, ingredient);
    return '(?, ?)';
  }), ', ');
  const instData = _.join(_.map(instructions, (instruction) => {
    args.push(recipeId, parseInt(instruction, 10), _.trimStart(instruction, '0123456789. '));
    return '(?, ?, ?)';
  }));
  const ingr = `
INSERT INTO ingredients 
  (recipe_id, ingredient)
VALUES ${ingrData};
  `;
  const inst = `
INSERT INTO instructions
  (recipe_id, number, instruction)
VALUES ${instData};
`;
  return ingr + inst;
};


const createRecipe = (res, recipe) => {
  // Query for creating a recipe
  let query = createQuery;
  console.log(recipe);
  // Params for base query
  const queryParams = [
    recipe.id,
    recipe.owner,
    recipe.creator,
    recipe.title,
    recipe.prep_time,
    recipe.cook_time,
    recipe.description,
    recipe.photo,
    recipe.creation_ts,
    recipe.modification_ts,
    recipe.rating
  ];

  query += updateIngrAndInst(recipe.id, queryParams, recipe.ingredients, recipe.instructions);

  console.log(query);

  // Run query
  multiConnection.query(query, queryParams, (err) => {
    res.json({
      success: (err) ? false : true,
      msg: (err) ? err.sqlMessage : undefined
    });
  });
};


const updateRecipe = (res, recipe) => {
  // Query to delete instructions and ingredients and update base
  let query = `${updateQuery}${deleteInstQuery}${deleteIngrQuery}`;

  // Params for base query
  const queryParams = [
    recipe.owner,
    recipe.title,
    recipe.prep_time,
    recipe.cook_time,
    recipe.description,
    recipe.photo,
    recipe.modification_ts,
    recipe.rating,
    recipe.id,
    recipe.id,
    recipe.id
  ];

  // Add insertions for ingredients/instructions
  query += updateIngrAndInst(recipe.id, queryParams, recipe.ingredients, recipe.instructions);

  // Run queries
  multiConnection.query(query, queryParams, (err) => {
    res.json({
      success: (err) ? false : true,
      msg: (err) ? err.sqlMessage : undefined
    });
  });
};


const deleteRecipe = (res, id) => {
  let query = deleteQuery;
  connection.query(query, [id], (err) => {
    res.json({
      success: (err) ? false : true,
      msg: (err) ? err.sqlMessage : undefined
    });
  });
};


export {
  createRecipe,
  updateRecipe,
  deleteRecipe
};
