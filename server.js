var io = require('socket.io')()
io.on('connect', (client) => {
    console.log("client connected")
    console.log(client)
})
io.listen(8080)
