
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('posts', table =>{
  table.integer('event_id').notNull().alter();
});
};

exports.down = function(knex, Promise) {
return knex.schema.alterTable('posts', table =>{
  table.integer('event_id').notNull()
});
};
