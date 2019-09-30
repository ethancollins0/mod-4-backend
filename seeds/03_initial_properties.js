
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('properties').del()
    .then(function () {
      // Inserts seed entries
      return knex('companies').where('name', 'First Co')
        .then(resp => resp[0].id)
        .then(id => {
          return knex('properties').insert([
            {address: '123 First Property Lane',
             latest_survey_date: 'August 12th, 2019', 
             company_id: id, 
             tenant_name: "Jill Bismith", 
             tenant_email: "jillybean@gmail.com", 
             tenant_phone: '832-732-1785'},
             
            {address: '719 Second Property Lane', 
            latest_survey_date: 'January 3rd, 2019', 
            company_id: id, 
            tenant_name: "Bob Burger", 
            tenant_email: "tina@gmail.com", 
            tenant_phone: '123-456-7890'},
          ])
        })
    });
};
// t.string('address')
// t.string('tenant_name')
// t.string('tenant_email')
// t.string('tenant_phone')
// t.string('latest_survey_date')