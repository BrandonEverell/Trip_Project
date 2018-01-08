// Update with your config settings.
const sharedConfig = {
  client: 'postgresql',
  migrations: {
    tableName: 'knex_migrations',
    directory: './db/migrations'
  }
}

module.exports = {

  development: {
    ...sharedConfig,
    connection: {
      database: 'trip-database'
    }
  },

  staging: {
  ...sharedConfig,
    connection: {
    database: 'trip-database'
    }
},

  production: {
    client: 'pg',
    debug: true,
    connection: process.env.DATABASE_URL
  migrations: {
    tableName: 'knex_migrations',
    directory: './db/migrations'
  },
  ssl: true;
  }

};
