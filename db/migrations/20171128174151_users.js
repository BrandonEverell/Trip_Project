
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id');
    table.string('facebookID').unique();
    table.string('googleID').unique();
    table.string('first_name')
    table.string('last_name')
    table.string('email')
    table.string('photo_path')
    table.text('about')
    table.string('passwordDigest').notNull()
    table.boolean('admin').notNull().defaultTo(false);
    table.timestamps(false, true)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
};
