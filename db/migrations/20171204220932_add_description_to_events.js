
exports.up = function(knex, Promise) {
  return knex.schema.table('events', table => {
    table.text('description')
  });
};

exports.down = function(knex, Promise) {
return knex.schema.table('events', table => {
  table.dropColumn('description')
})
};
