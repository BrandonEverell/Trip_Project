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
    ...sharedConfig,
    connection: {
    database: 'trip-database'

    }
  }

};
