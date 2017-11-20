import mysql from 'mysql';

import config from './config.json';

const options = {
  user: config.MYSQL_USER,
  password: config.MYSQL_PASSWORD,
  database: 'reci_p'
};

const connection = mysql.createConnection(options);

export default connection;
