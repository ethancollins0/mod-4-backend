
exports.up = function(knex) {
  return knex.schema.createTable('employees', (t) => {
      t.increments('id')
      t.string('name')
      t.string('email')
      t.integer('company_id').unsigned()
      t.foreign('company_id').references('companies.id')
  })
};

exports.down = function(knex) {
  
};
