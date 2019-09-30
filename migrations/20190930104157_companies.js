
exports.up = function(knex) {
    return knex.schema.createTable('companies', (t) => {
        t.increments('id')
        t.string('name')
        t.string('username')
        t.string('password')
    })
};

exports.down = function(knex) {
  
};
