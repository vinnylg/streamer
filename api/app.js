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
    if (req.query.path && req.query.path.type)
        services.sendVideo(
            services.rootPath + req.query.path,
            req.query.path.type,
            req,
            res
        )
    else res.status(404)
})

app.get('/list', (req, res) => {
    const listPath = req.query.path
    console.log(listPath)
    const items = services.listItems(listPath)
    res.json({ items })
})

module.exports = app
