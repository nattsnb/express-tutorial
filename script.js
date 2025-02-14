const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const jsonParser = bodyParser.json()


const port = 3000

app.get('/', (req, res) => {
    res.send({string: 'Hello World!'})
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


let users = []

app.post("/users", jsonParser, (req, res) => {
    console.log(req.body)
    users.push(req.body)
    res.send(users)
})

app.get('/users', (req, res) => {
    res.send(users)
})