import { connection } from '../../../db';


const userSearch = (res, partial, { ignore, page }) => {
  let query = `
    SELECT * FROM users WHERE username LIKE ?
  `;

  // Query
  const params = [`${partial}%`];

  // Ignore single username
  if (ignore) {
    params.push(ignore);
    query += ' AND username != ?';
  }
  // Set maximum of 10 coming back
  query += ' LIMIT 10';

  // Add a page offset
  params.push((parseInt(page, 10) || 0) * 10);
  query += ' OFFSET ?';

  // Make query to database
  connection.query(query, params, (err, result) => {
    res.json({
      success: (err) ? false : true,
      msg: (err) ? err.sqlMessage : undefined,
      data: (err) ? undefined : JSON.parse(JSON.stringify(result))
    });
  });
};


const getFollowing = (res, { id }) => {
  const query = `
  SELECT * FROM users
    WHERE id IN (SELECT producer FROM relations WHERE consumer = ?)
  `;

  connection.query(query, [id], (err, result) => {
    res.json({
      success: (err) ? false : true,
      msg: (err) ? err.sqlMessage : undefined,
      data: (err) ? undefined : JSON.parse(JSON.stringify(result))
    });
  });
};


const getUser = (res, id) => {
  const query = `
    SELECT * FROM users WHERE id=? GROUP BY users.id LIMIT 1
  `;

  // Make query to database
  connection.query(query, [id], (err, result) => {
    res.json({
      success: (err) ? false : true,
      msg: (err) ? err.sqlMessage : undefined,
      data: (err) ? undefined : JSON.parse(JSON.stringify(result[0]))
    });
  });
};


export {
  userSearch,
  getUser,
  getFollowing
};
