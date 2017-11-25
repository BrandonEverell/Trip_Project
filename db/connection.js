const kx = require('knex')({
   client: 'pg',
   connection: {
     database: 'trip-database'
   }
 })

 module.exports = kx
