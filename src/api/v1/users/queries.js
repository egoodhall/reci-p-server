import _ from 'lodash';

import { connection } from '../../../db';


const processUser = (user) => {
  if (user.following) {
    user.following = user.ingredients.split(', ');
  }
  return user;
};


const getUsers = (res, partial, { ignore, page }) => {
  let query = `
    SELECT u.*,
      GROUP_CONCAT(r.producer separator ', ') as following
    FROM users u
      LEFT JOIN relations r ON r.consumer = u.id
    WHERE username LIKE ?
  `;

  // Query
  const params = [`%${partial}%`];

  // Ignore single username
  if (ignore) {
    params.push(ignore);
    query += ' AND username != ?';
  }
  // Set maximum of 10 coming back
  query += ' GROUP BY u.id LIMIT 10';

  // Add a page offset
  params.push((parseInt(page, 10) || 0) * 10);
  query += ' OFFSET ?';

  // Make query to database
  connection.query(query, params, (err, result) => {
    res.json({
      success: (err) ? false : true,
      msg: (err) ? err.sqlMessage : undefined,
      data: (err) ? undefined : _.map(result, processUser)
    });
  });
};


const getUser = (res, id) => {
  let query = `
    SELECT users.*,
      GROUP_CONCAT(relations.producer separator ', ') as following
    FROM users
      LEFT JOIN relations ON relations.consumer = users.id
    WHERE id=? GROUP BY users.id LIMIT 1
  `;

  // Make query to database
  connection.query(query, [id], (err, result) => {
    res.json({
      success: (err) ? false : true,
      msg: (err) ? err.sqlMessage : undefined,
      data: (err) ? undefined : processUser(result[0])
    });
  });
};


export {
  getUsers,
  getUser
};
