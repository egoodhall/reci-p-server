import connection from '../../../db';

const createUser = (res, user) => {
  let query = 'INSERT INTO users (username, displayname, id) VALUES (?, ?, ?)';
  connection.query(query, [user.username, user.displayname, user.id], (err) => {
    res.json({
      success: (err) ? false : true,
      msg: (err) ? err.sqlMessage : undefined
    });
  });
};

const follow = (res, follower, target) => {
  let query = 'INSERT INTO relations (follower, target) VALUES (?, ?)';
  connection.query(query, [follower, target], (err) => {
    res.json({
      success: (err) ? false : true,
      msg: (err) ? err.sqlMessage : undefined
    });
  });
};

const unfollow = (res, follower, target) => {
  let query = 'DELETE FROM relations WHERE follower=? AND target=?';
  connection.query(query, [follower, target], (err) => {
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
