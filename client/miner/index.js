const
    io = require("socket.io-client"),
    socket = io.connect("http://localhost:20183");
    crypto = require('crypto');
const { randomInt, randomBytes } = require("crypto");
socket.emit('get-m')
var tt = 0
var d = Date.now()
console.log("Starting Vortech Miner (",d,")")
socket.on('get-m', (x) =>{
    console.log('\x1b[32m','⛏ Received Problem: ','\x1b[37m',x)
    var m = randomInt(99999999999999)
    var y = crypto.createHash('sha256').update("v:"+m).digest('hex');
    var t = 0
    var z = false
    while(!z){
        var m = randomInt(99999999999999)
        y = crypto.createHash('sha256').update(m.toString()).digest('hex');
        z = y[0] == x[0] && y[1] == x[1] && y[2] == x[2] && y[3] == x[3] && y[4] == x[4]
        t++
        tt++
    }
    console.log('\x1b[32m','⛏ Solved Problem: ','\x1b[37m',x,'\x1b[36m',' Tries: '+t,'\x1b[31m','H/s: '+Math.round(1000*(tt/(Date.now()-d))))
    console.log(y)
    socket.emit('f-m', x, m)
    setTimeout(() => {  socket.emit('get-m') }, 200);
})