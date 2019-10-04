
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('properties').del()
    .then(function () {
      // Inserts seed entries
      return knex('companies').where('name', 'First Co')
        .then(resp => resp[0].id)
        .then(id => {
          return knex('properties').insert([
            {address: 'Silicon Valley Lane',
             latest_survey_date: '2019-10-13', 
             company_id: id, 
             tenant_name: "Ed Chambers", 
             tenant_email: "you-got-ed@gmail.com", 
             tenant_phone: '832-732-1785'},

            {address: '719 Second Property Lane', 
            latest_survey_date: '2019-01-03', 
            company_id: id, 
            tenant_name: "Bob Burger", 
            tenant_email: "tina@gmail.com", 
            tenant_phone: '123-456-7890'},

            {address: '123 First Property Lane',
             latest_survey_date: '2019-10-13', 
             company_id: id, 
             tenant_name: "Robin Galloway", 
             tenant_email: "robg@gmail.com", 
             tenant_phone: '281-173-9999'},

            {address: '4444 Third Property Lane', 
            latest_survey_date: '2019-05-03', 
            company_id: id, 
            tenant_name: "A Celebrity", 
            tenant_email: "celeb@gmail.com", 
            tenant_phone: '466-786-1895'},

            {address: '7991 Big Rock Cove St.',
            latest_survey_date: '2019-10-13', 
            company_id: id, 
            tenant_name: "Bree Wiggins", 
            tenant_email: "breewiggins@gmail.com", 
            tenant_phone: '832-732-1785'},

           {address: '8990 SW. Rockland Lane', 
           latest_survey_date: '2019-05-29', 
           company_id: id, 
           tenant_name: "Jan the Man", 
           tenant_email: "jantheman@gmail.com", 
           tenant_phone: '127-124-2142'},

           {address: '14 Bald Hill Ave.',
           latest_survey_date: '2019-05-22', 
           company_id: id, 
           tenant_name: "Nella Blackmore", 
           tenant_email: "nellab@gmail.com", 
           tenant_phone: '555-123-0000'},

          {address: '763 Essex Ave.', 
          latest_survey_date: '2018-03-13', 
          company_id: id, 
          tenant_name: "Sabina York", 
          tenant_email: "sabina@gmail.com", 
          tenant_phone: '187-555-1832'},
          ])
        })
    });
};
// t.string('address')
// t.string('tenant_name')
// t.string('tenant_email')
// t.string('tenant_phone')
// t.string('latest_survey_date')