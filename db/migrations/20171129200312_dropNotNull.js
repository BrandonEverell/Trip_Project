
exports.up = function(knex, Promise) {
  return knex.schema.raw('ALTER TABLE posts ALTER COLUMN event_id DROP NOT NULL')
};

exports.down = function(knex, Promise) {
return knex.schema.raw('ALTER TABLE posts ALTER COLUMN event_id SET NOT NULL')
};
