const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);

const socketIo = require('socket.io');

const io = socketIo(server) //Can be updated..

server.listen(3000, () => {
    console.log('Running...')
})

app.use(express.static(__dirname + '/public'));

let history = [];

io.on('connection', socket => {
    console.log('New connection to Gartic.IO')

    history.forEach(line => {
        socket.emit('draw',line)
    })

    socket.on('draw',line => {
        history.push(line)
        io.emit('draw', line)
    })

    socket.on('delete_draw',() => {
        io.emit('delete')
        history = []
    })
})