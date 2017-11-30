
exports.up = function(knex, Promise) {
  return knex.schema.createTable('attendees', table =>{
    table.integer('event_id').references('id').inTable('events').notNull().onDelete('cascade');
    table.integer('user_id').references('id').inTable('users').notNull().onDelete('cascade');
    table.timestamps(false, true)
  })
};

exports.down = function(knex, Promise) {
return knex.schema.dropTable('attendees')
};
