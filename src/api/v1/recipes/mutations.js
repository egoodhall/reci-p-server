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
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      owner=VALUES(owner), title=VALUES(title), prep_time=VALUES(prep_time),
      cook_time=VALUES(cook_time), description=VALUES(description),
      photo=VALUES(photo), modification_ts=VALUES(modification_ts),
      rating=VALUES(rating);

    DELETE FROM ingredients WHERE recipe_id=?;
    DELETE FROM instructions WHERE recipe_id=?;

    ${(recipe.ingredients && recipe.ingredients.length > 0) ? insertIngrQuery(recipe.ingredients) : ''}
    ${(recipe.instructions && recipe.instructions.length > 0) ? insertInstQuery(recipe.instructions) : ''}
  `;

  // console.log(recipe);

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

  // Delete old ingredients
  params.push(recipe.id);
  // Delete old instructions
  params.push(recipe.id);
  // Insert all ingredients
  _.forEach(recipe.ingredients, (ingredient) => params.push(
    recipe.id,
    ingredient
  ));
  // Insert all instructions
  _.forEach(recipe.instructions, (instructions, idx) => params.push(
    recipe.id,
    idx + 1,
    instructions
  ));

  console.log(query);
  console.log();
  console.log(params);

  // Run query
  multiConnection.query(query, params, (err) => {
    console.log(err);
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
  deleteRecipe
};
