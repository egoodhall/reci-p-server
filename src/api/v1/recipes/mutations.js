import connection from '../../../db';

const createQuery = `
  INSERT INTO recipes (id, owner, creator, prep_time, cook_time, description, instructions, photo, creation_ts, modificaton_ts, rating)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

const updateQueryExt = `ON DUPLICATE KEY
  id=id, owner=owner, creator=creator, prep_time=prep_time, cook_time=cook_time, description=description, instructions=instructions, photo=photo, creation_ts=creation_ts, modification_ts=modification_ts, rating=rating
  `;

const createRecipe = (res, recipe) => {
  const { id, owner, creator, prepTime, cookTime, description, instructions, photo, creationTS, modificationTS, rating } = recipe;
  const queryParams = [ id, owner, creator, prepTime, cookTime, description, instructions, photo, creationTS, modificationTS, rating ];
  let query = createQuery;
  connection.query(query, queryParams, (err) => {
    res.json({
      success: (err) ? false : true,
      msg: (err) ? err.sqlMessage : undefined
    });
  });
};

const updateRecipe = (res, recipe) => {
  let query = createQuery + updateQueryExt;
  const { id, owner, creator, prepTime, cookTime, description, instructions, photo, creationTS, modificationTS, rating } = recipe;
  const queryParams = [ id, owner, creator, prepTime, cookTime, description, instructions, photo, creationTS, modificationTS, rating ];
  connection.query(query, queryParams, (err) => {
    res.json({
      success: (err) ? false : true,
      msg: (err) ? err.sqlMessage : undefined
    });
  });
};

const deleteRecipe = (res, id) => {
  let query = 'DELETE FROM recipes WHERE id=?';
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
