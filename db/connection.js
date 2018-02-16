const knexConfig = require('../knexfile')[process.env.NODE_ENV || 'development']
const kx = require('knex')(knexConfig)

module.exports = kx;
