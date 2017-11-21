import mysql from 'mysql';
import _ from 'lodash';

import config from '../config.json';

const options = {
  user: config.MYSQL_USER,
  password: config.MYSQL_PASSWORD,
  database: 'reci_p'
};

if (process.env.INSTANCE_CONNECTION_NAME && process.env.NODE_ENV === 'production') {
  options.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
}

const connection = mysql.createConnection(options);
const multiConnection = mysql.createConnection(_.assign(options, { multipleStatements: true }));

export {
  connection,
  multiConnection
};
