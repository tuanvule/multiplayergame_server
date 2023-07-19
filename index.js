// import express from 'express';

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app)
// const {Server} = require('socket.io')
// const io = new Server(server)
const players = {}
const port = 'https://multiplayergame-server.vercel.app/'

const io = require("socket.io")('https://multiplayergame-server.vercel.app/', {
    cors: {
      origin: "https://2dgamev23.vercel.app/",
      methods: ["GET", "POST"]
    },
    pingInterval: 2000,
    pingTimeout: 5000,
  });
// console.log(io)

app.use(express.static("public"))

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://2dgamev23.vercel.app/");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
  })

app.get('/', (req, res) => {
    // res.sendFile(__dirname + 'index.html')
    res.json({ message: 'something'})
})

function random_rgba() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + '1' + ')';
}

io.on('connection', (socket) => {
    console.log('someone is connected')
    // console.log(socket)
    
    players[socket.id] = {
        x: 100,
        y: 200,
        color: random_rgba()
    }
    io.emit('updatePlayers', players)

    // socket.on('updatePlayers', (data) => {
    //     for (const id in data) {
    //         players[id] = data[id]
    //     }
    //     io.emit('updatePlayers', players)
        // console.log('something')
    // })
    
    socket.on('keydown', (key) => {
        switch (key) {
            case 'w':
                players[socket.id].y -= 10
                break;
            case 'a':
                players[socket.id].x -= 4
                break;
            case 'd':
                players[socket.id].x += 4
                break;
        
            default:
                break;
        }
        // io.emit('updatePlayers', players)
    })

    socket.on('gravity', (velocityY) => {
        console.log('not landing')
        players[socket.id].y = velocityY
    })
    socket.on('moveX', (x) => {
        console.log('not landing')
        players[socket.id].x = x
    })

    socket.on('disconnect', (reason) => {
        delete players[socket.id]
        // io.emit('updatePlayers', players)
    })

})

setInterval(() => {
    io.emit('updatePlayers', players)
}, 1)

server.listen(port, () => {
    console.log('sever is ready')
})