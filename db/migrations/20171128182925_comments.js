
exports.up = function(knex, Promise) {
  return knex.schema.createTable('comments', table => {
    table.increments('id')
    table.text('content')
    table.integer('user_id').references('id').inTable('users').notNull().onDelete('cascade');
    table.integer('post_id').references('id').inTable('posts').notNull().onDelete('cascade');
    table.timestamps(false, true)
  })
};

exports.down = function(knex, Promise) {
return knex.schema.dropTable('comments')
};
