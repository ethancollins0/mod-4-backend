const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const db = require('./database_connection')

const app = express()
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.use(cors())

app.get('/home', (req, res) => {
    const company_data = {}
    const get_data = db.getEmployees('username')
        .then(employees => company_data['employees'] = employees)
        .then(db.getProperties('username'))
        .then(properties => {
            company_data['properties'] = properties
            return company_data
        })
        get_data.then(data => res.json(data))
})

app.post('/', (req, res) => {
    res.json('POST')
})

app.put('/', (req, res) => {
    res.json('PUT')
})




const port = process.env.PORT || 3001

app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})

