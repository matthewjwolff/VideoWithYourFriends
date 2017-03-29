const io = require('socket.io')()
const url = require('url')
io.on('connect', (socket) => {
    console.log("connected: "+socket.id)
    // This socket should be added to the list of sockets
    console.log(typeof socket.id)
    clientStatuses[socket.id] = false
    console.log(clientStatuses)
    socket.on('add', (data) => {
        // TODO: query youtube for the video information, add them to the videos, and then resend
        videos.push(parseUrl(data))
        io.emit('list', videos)
        if(currentVideo == null)
            cueNextVideo()
    })

    socket.on("ready", (data) => {
        clientStatuses[socket.id] = true
    })

    socket.on("disconnect", (reason) => {
        delete clientStatuses[socket.id]
        console.log(clientStatuses)
    })
})

var videos = []
var currentVideo

function parseUrl(theUrl) {
    // Parse the url with node's builtin URL module, true makes it parse the query string as well
    return url.parse(theUrl, true).query["v"]
}

var clientStatuses = {}

function cueNextVideo() {
    io.emit('cue', videos[0])
    // TODO: set statuses
    setTimeout(checkReadyness, 100)
}

// TODO: check for connection / skip laggy but connected people
function checkReadyness() {
    console.log("testing readyness")
    console.log(clientStatuses)
    var ready = true
    for( cId in clientStatuses ) {
        ready *= clientStatuses[cId]
    }
    if(ready)
        io.emit('play', videos[0])
    else
        setTimeout(checkReadyness, 100)
}

io.listen(8080)
