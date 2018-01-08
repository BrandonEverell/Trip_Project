
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('comments', table => {
    table.integer('event_id').references('id').inTable('events')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('comments', table => {
    table.dropColumn('event_id')
  })
};
