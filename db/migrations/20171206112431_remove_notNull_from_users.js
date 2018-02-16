exports.up = function(knex, Promise) {
  return knex.schema.raw('ALTER TABLE users ALTER COLUMN "passwordDigest" DROP NOT NULL')
};

exports.down = function(knex, Promise) {
return knex.schema.raw('ALTER TABLE users ALTER COLUMN "passwordDigest" SET NOT NULL')
};
