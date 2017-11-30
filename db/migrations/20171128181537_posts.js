
exports.up = function(knex, Promise) {
  return knex.schema.createTable('posts', table =>{
    table.increments('id');
    table.string('title')
    table.text('content')
    table.string('photo_path')
    table.integer('user_id').references('id').inTable('users').notNull().onDelete('cascade');
    table.integer('event_id').references('id').inTable('events').notNull().onDelete('cascade');
    table.timestamps(false, true)
  })
};

exports.down = function(knex, Promise) {
return knex.schema.dropTable('posts')
};
