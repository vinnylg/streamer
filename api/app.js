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
        console.err(err)
        res.status(404).json({ err })
    }
})

app.get('/list', (req, res) => {
    try {
        const listPath = req.query.path
        const items = services.listItems(listPath)
        res.json({ items })
    } catch (err) {
        console.err(err)
        res.status(404).json({ err })
    }
})

app.get('/likes', (req, res) => {
    try {
        let likes = services.getLikes()
        res.json({ likes })
    } catch (err) {
        console.err(err)
        res.status(404).json({ err })
    }
})

app.post('/like', (req, res) => {
    try {
        const { currentItem } = req.body
        let likes = services.getLikes()
        if (likes.find(({ id }) => id === currentItem.id)) {
            likes = likes.filter(({ id }) => id !== currentItem.id)
            currentItem.liked = false
        } else {
            likes.push(currentItem)
            currentItem.liked = true
        }
        services.setLikes(likes)
        res.json({ currentItem })
    } catch (err) {
        console.err(err)
        res.status(404).json({ err })
    }
})


app.get('/watched', (req, res) => {
    try {
        const watched = services.getWatched()
        res.json({ watched })
    } catch (err) {
        console.error(err)
        res.status(404).json({ err })
    }
})

app.post('/watched', (req, res) => {
    try {
        const { currentItem } = req.body
        const watched = services.getWatched()
        if (!watched.find(item => item.id === currentItem.id)) {
            currentItem.watched = Date.now()
            watched.unshift(currentItem)
            services.setWatched(watched)
        }
        res.json({})
    } catch (err) {
        console.error(err)
        res.status(404).json({ err })
    }
})

app.post('/watching', (req, res) => {
    try {
        const { currentItem, watching } = req.body
        services.setWatching({ ...currentItem, watching })
        res.status(200).json({})
    } catch (err) {
        console.error(err)
        res.status(404).json({ err })
    }
})

app.delete('/watching', (req, res) => {
    try {
        services.deleteWatching()
        res.status(200)
    } catch (err) {
        console.error(err)
        res.status(404).json({ err })
    }
})

app.get('/watching', (req, res) => {
    try {
        const watching = services.getWatching()
        res.json({ watching })
    } catch (err) {
        console.error(err)
        res.status(404).json({ err })
    }
})


module.exports = app
