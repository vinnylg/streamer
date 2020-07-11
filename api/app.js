var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var cors = require('cors')
var services = require('./services.js')

var app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())

app.get('/video', (req, res) => {
    services.sendVideo('/home/vinny/Videos/' + req.query.path, req, res)
})

app.get('/list', (req, res) => {
    try {
        const listPath = req.query.path
        const items = services.listItems(listPath)
        res.json({ items })
    } catch (err) {
        res.status(404).json({ err })
    }
})

module.exports = app
