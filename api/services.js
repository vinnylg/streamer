var fs = require('fs')

const videoExt = [
    '.mpg',
    '.mpeg',
    '.avi',
    '.wmv',
    '.mov',
    '.ogg',
    '.webm',
    '.mp4'
]

const containTerm = (str, terms) => {
    for (let term of terms) if (str.toLowerCase().includes(term)) return true
    return false
}

const rootPath = '/home/vinny/Videos'

const listItems = path => {
    if (fs.lstatSync(rootPath + path).isDirectory()) {
        let raw = fs
            .readdirSync(rootPath + path)
            .filter(name => name != 'streamer' && name[0] != '.')
        let items = []
        raw.forEach(item => {
            let stats = fs.lstatSync(rootPath + path + '/' + item)
            if (stats.isFile()) {
                if (containTerm(item, videoExt))
                    items.push({ name: item, isVideo: 1 })
            } else if (stats.isDirectory())
                items.push({ name: item, isVideo: 0 })
        })
        return items
    }
}

const sendVideo = (path, type, req, res) => {
    try {
        if (fs.existsSync(path)) {
            const stat = fs.statSync(path)
            const fileSize = stat.size
            const range = req.headers.range

            if (range) {
                const parts = range.replace(/bytes=/, '').split('-')
                const start = parseInt(parts[0], 10)
                const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1

                if (start >= fileSize) {
                    res.status(416).send(
                        'Requested range not satisfiable\n' +
                            start +
                            ' >= ' +
                            fileSize
                    )
                    return
                }

                const chunksize = end - start + 1
                const file = fs.createReadStream(path, { start, end })
                const head = {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': 'video/mp4'
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
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    videoExt,
    containTerm,
    rootPath,
    listItems,
    sendVideo
}
