var fs = require('fs')

const videoExt = ['mpg', 'mpeg', 'avi', 'wmv', 'mov', 'ogg', 'webm', 'mp4']

const rootPath = '/home/vinny/Videos'

const listItems = path => {
    const raw = fs
        .readdirSync(rootPath + path)
        .filter(name => name != 'streamer' && name[0] != '.')
    const items = []
    const likes = getLikes()
    raw.forEach((item, i) => {
        let stats = fs.lstatSync(rootPath + path + '/' + item)
        let id = stats.dev + '' + stats.ino
        if (stats.isFile()) {
            let name = item.split('.')
            let type = name.pop()
            let liked = false
            name = name.join()
            if (likes.includes(id))
                liked = true
            if (videoExt.includes(type))
                items.push({
                    id,
                    name,
                    liked,
                    type,
                    path: path + '/' + item
                })
        } else if (stats.isDirectory()) {
            let fullpath = path === '/' ? path + item : path + '/' + item
            items.push({
                id,
                name: item.replace(/-/g, ' ').toUpperCase(),
                type: 'dir',
                path: fullpath
            })
        }
    })
    return items
}

const sendVideo = (path, req, res) => {
    path = rootPath + path
    let type = path.split('.')[1]
    const stat = fs.statSync(path)
    const fileSize = stat.size
    const range = req.headers.range
    if (range) {
        const parts = range.replace(/bytes=/, '').split('-')
        const start = parseInt(parts[0], 10)
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
        const chunksize = end - start + 1
        const file = fs.createReadStream(path, { start, end })
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/' + type
        }
        res.writeHead(206, head)
        file.pipe(res)
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/' + type
        }
        res.writeHead(200, head)
        fs.createReadStream(path).pipe(res)
    }
}

const getLikes = () => {
    let likes = []
    if (fs.existsSync(rootPath + '/.likes.json')) {
        let raw = fs.readFileSync(rootPath + '/.likes.json')
        likes = JSON.parse(raw).data
    }
    return likes
}

const setLikes = (likes) => {
    let raw = JSON.stringify({ data: likes })
    fs.writeFileSync(rootPath + '/.likes.json', raw)
}

module.exports = {
    videoExt,
    rootPath,
    listItems,
    sendVideo,
    getLikes,
    setLikes
}
