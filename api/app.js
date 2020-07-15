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
    try {
        services.sendVideo(req.query.path, req, res)
    } catch (err) {
        console.log(err)
        res.status(404).json({ err })
    }
})

app.get('/list', (req, res) => {
    try {
        const listPath = req.query.path
        const items = services.listItems(listPath)
        res.json({ items })
    } catch (err) {
        console.log(err)
        res.status(404).json({ err })
    }
})

app.post('/like', (req, res) => {
    try {
        const { currentItem } = req.body
        let likes = services.getLikes()
        if (likes.find(id => id === currentItem.id)) {
            likes = likes.filter(id => id !== currentItem.id)
            currentItem.liked = false
        } else {
            likes.push(currentItem.id)
            currentItem.liked = true
        }
        services.setLikes(likes)
        res.json({ currentItem })
    } catch (err) {
        console.log(err)
        res.status(404).json({ err })
    }
})

module.exports = app
