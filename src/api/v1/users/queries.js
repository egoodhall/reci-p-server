import _ from 'lodash';

import { connection } from '../../../db';


const addFilter = (queryString, value) => {
  if (queryString.includes('WHERE')) {
    return `${queryString} AND ${value}`;
  }
  return `${queryString} WHERE ${value}`;
};


const getUsers = (res, filters) => {
  let queryParams = [];
  let query = 'SELECT * FROM users';

  // Searching by username
  if (_.has(filters, 'username') === true) {
    query = addFilter(query, 'username LIKE ?');
    queryParams += `%${filters.username}%`;

  // Retrieving people followed by user
  } else if (_.has(filters, 'followedBy')) {
    query = addFilter(query, 'id IN (SELECT target FROM relations)');
  }

  // Make query to database
  connection.query(query, queryParams, (err, result) => {
    res.json({
      success: (err) ? false : true,
      msg: (err) ? err.sqlMessage : undefined,
      data: result
    });
  });
};


const getUser = (res, id) => {
  let query = 'SELECT * FROM users WHERE id=? LIMIT 1';
  connection.query(query, [id], (err, result) => {
    res.json({
      success: (err) ? false : true,
      msg: (err) ? err.sqlMessage : undefined,
      data: result
    });
  });
};


export {
  getUsers,
  getUser
};
