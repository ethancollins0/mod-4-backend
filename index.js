const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {
    res.json('GET')
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

