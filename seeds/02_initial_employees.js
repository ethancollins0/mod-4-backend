exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('employees').del()
    .then(function () {
      // Inserts seed entries
  return knex('companies').where('name', 'First Co')
  .then(resp => resp[0].id)
  .then(id => {
    return knex('employees').insert([
        {name: 'Susan McMilligan', email: 'suze@gmail.com', company_id: id},
        {name: 'Bobby Robertson', email: 'bobert@yahoo.com', company_id: id},
      ]);
    });
  })
      
};

// t.increments('id')
//       t.string('name')
//       t.string('email')
//       t.integer('company_id').unsigned()
