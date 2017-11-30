
exports.up = function(knex, Promise) {
  return knex.schema.createTable('events', table =>{
   table.increments('id')
   table.string('title')
   table.date('date')
   table.timestamps(false, true)
   table.integer('creator_id').references('id').inTable('users').notNull().onDelete('cascade');
  })
};

exports.down = function(knex, Promise) {
return knex.schema.dropTable('events')
};
