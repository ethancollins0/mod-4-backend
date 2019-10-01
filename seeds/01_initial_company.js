const bcrypt = require('bcrypt')

exports.seed = function(knex) {
  // Deletes ALL existing entries
  knex('employees').del().then(console.log('employees deleted'))
  knex('properties').del().then(console.log('properties deleted'))
  return knex('companies').del()
    .then(function () {
      // Inserts seed entries
      return bcrypt.hash('password', 10).then((hash) => {
        return knex('companies').insert([
          {name: 'First Co', username: 'username' , password: hash}
        ])
      })
      
    });
};
