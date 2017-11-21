import { connection } from '../../../db';

const createUser = (res, user) => {
  let query = 'INSERT IGNORE INTO users (username, displayname, id) VALUES (?, ?, ?)';
  connection.query(query, [user.username, user.displayname, user.id], (err) => {
    res.json({
      success: (err) ? false : true,
      msg: (err) ? err.sqlMessage : undefined
    });
  });
};

const follow = (res, consumer, producer) => {
  let query = 'INSERT INTO relations (consumer, producer) VALUES (?, ?)';
  connection.query(query, [consumer, producer], (err) => {
    res.json({
      success: (err) ? false : true,
      msg: (err) ? err.sqlMessage : undefined
    });
  });
};

const unfollow = (res, consumer, producer) => {
  let query = 'DELETE FROM relations WHERE consumer=? AND producer=?';
  connection.query(query, [consumer, producer], (err) => {
    res.json({
      success: (err) ? false : true,
      msg: (err) ? err.sqlMessage : undefined
    });
  });
};

export {
  createUser,
  follow,
  unfollow
};
