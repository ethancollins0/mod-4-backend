
exports.up = function(knex) {
    return knex.schema.createTable('properties', (t) => {
        t.increments('id')
        t.string('address')
        t.string('tenant_name')
        t.string('tenant_email')
        t.string('tenant_phone')
        t.string('latest_survey_date')
        t.integer('company_id').unsigned()
        t.foreign('company_id').references('companies.id')
    })
};

exports.down = function(knex) {
  
};
