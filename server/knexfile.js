const { dbConfig } = require('./config/db');

module.exports = {
  development: {
    client: 'mysql2',
    connection: dbConfig,
    migrations: {
      tableName: 'knex_migrations',
      directory: './', // Use './' for the root directory
    },
    seeds: {
      directory: './seeds',
    },
  },
};
