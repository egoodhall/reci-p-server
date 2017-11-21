import { multiConnection, connection } from '../../../db';

import _ from 'lodash';


const insertIngrQuery = (ingr) => {
  return `
    INSERT INTO ingredients
      (recipe_id, ingredient)
    VALUES
      ${_.join(Array(ingr.length).fill('(?, ?)'), ', ')};
  `;
};


const insertInstQuery = (inst) => {
  return `
    INSERT INTO instructions
      (recipe_id, number, instruction)
    VALUES
      ${_.join(Array(inst.length).fill('(?, ?, ?)'), ', ')};
  `;
};


const createRecipe = (res, recipe) => {
  let query = `
    INSERT INTO recipes
      (id, owner, creator, title, prep_time, cook_time, description, photo, creation_ts, modification_ts, rating)
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

    ${(recipe.ingredients) ? insertIngrQuery(recipe.ingredients) : ''}
    ${(recipe.instructions) ? insertInstQuery(recipe.ingredients) : ''}
  `;

  // Params for base query
  const params = [
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

  // Insert all ingredients
  _.forEach(recipe.ingredients, (ingredient) => params.push(recipe.id, ingredient));

  // Insert all recipe.instructions
  _.forEach(recipe.instructions, (instructions) => params.push(
    recipe.id,
    parseInt(instructions, 10),
    _.trimStart(instructions, '0123456789. ')
  ));

  console.log(query);
  console.log(params.length);

  res.json({ query });

  // Run query
  multiConnection.query(query, params, (err) => {
    res.json({
      success: (err) ? false : true,
      msg: (err) ? err.sqlMessage : undefined
    });
  });
};


const updateRecipe = (res, recipe) => {

  // Query to delete instructions and ingredients and update base
  let query = `
    UPDATE recipes SET
      owner=?, title=?, prep_time=?, cook_time=?, description=?, photo=?, modification_ts=?, rating=?
    WHERE id=?;

    DELETE FROM ingredients WHERE recipe_id=?;
    ${(recipe.ingredients) ? insertIngrQuery(recipe.ingredients) : ''}
    DELETE FROM instructions WHERE recipe_id=?;
    ${(recipe.instructions) ? insertInstQuery(recipe.ingredients) : ''}
  `;

  // Params for base query
  const params = [
    recipe.owner,
    recipe.title,
    recipe.prep_time,
    recipe.cook_time,
    recipe.description,
    recipe.photo,
    recipe.modification_ts,
    recipe.rating,
    recipe.id
  ];

  // Delete old ingredients
  params.push(recipe.id);
  // Insert all ingredients
  _.forEach(recipe.ingredients, (ingredient) => params.push(recipe.id, ingredient));
  // Delete old instructions
  params.push(recipe.id);
  // Insert all instructions
  _.forEach(recipe.instructions, (instructions) => params.push(
    recipe.id,
    parseInt(instructions, 10),
    _.trimStart(instructions, '0123456789. ')
  ));

  // Run queries
  multiConnection.query(query, params, (err) => {
    res.json({
      success: (err) ? false : true,
      msg: (err) ? err.sqlMessage : undefined
    });
  });
};


const deleteRecipe = (res, id) => {
  let query = 'DELETE FROM recipes WHERE id=?;';
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
