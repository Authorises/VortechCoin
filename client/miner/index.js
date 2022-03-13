const
    io = require("socket.io-client"),
    socket = io.connect("http://localhost:20183");
    crypto = require('crypto');
    prompt = require('prompt');
    inquirer = require('inquirer'); 
    readline = require('readline')

const { randomInt, randomBytes } = require("crypto");
const { exit } = require("process");

function onErr(err) {
    //console.log(err);
    return 1;
}
var tt = 0
var d = Date.now()
var walletChecked = false;
var u;
var ts=0
var b=0

const clearLastLine = () => {
    readline.moveCursor(process.stdout, 0, -1) // up one line
    readline.clearLine(process.stdout, 1) // from cursor to end
}

async function start(){
    const answers = await inquirer.prompt({
        name: 'id',
        type: 'input',
        message: 'Enter your wallet id',
    });

    u = answers.id;
    socket.emit('wallet-check', u)
}

socket.on('wallet-check', (status) =>{
    if(status){
        socket.emit('get-m')
    }else{
        console.log('! Error: Provided wallet id does not exist.')
        exit(0)
    }
})

socket.on('balupdate', (bal) =>{
    b+=bal
})

socket.on('get-m', (x) =>{
    clearLastLine()
    console.log('\x1b[32m','⛏  Received Problem: ','\x1b[37m',x,'\x1b[36m H/s: '+Math.round(1000*(tt/(Date.now()-d))),' \x1B[35mTotal Solved: ',ts,'\x1B[32m Total Balance: ',b)
    var m = randomInt(99999999999999)
    var y = crypto.createHash('sha256').update("v:"+m).digest('hex');
    var t = 0
    var z = false
    while(!z){
        m = randomInt(99999999999999)
        y = crypto.createHash('sha256').update(m.toString()).digest('hex');
        z = y[0] == x[0] && y[1] == x[1] && y[2] == x[2] && y[3] == x[3] && y[4] == x[4]
        t++
        tt++
    }
    clearLastLine()
    console.log('\x1b[32m','⛏  Solved Problem: ','\x1b[37m',y,'\x1b[36m H/s: '+Math.round(1000*(tt/(Date.now()-d))),' \x1B[35mTotal Solved: ',ts,'\x1B[32m Total Balance: ',b)
    socket.emit('f-m', x, m, u)
    setTimeout(() => {  socket.emit('get-m') }, 200);
    ts+=1
})

socket.on('error', (x,y) =>{
    console.log('\x1b[32m','! Received Error: '+x,'\x1b[37m',y)
})

start()

