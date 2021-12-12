const
    io = require("socket.io-client"),
    ioClient = io.connect("http://localhost:20183");

var a;
var wallet;

ioClient.emit('send-transaction', "2e90c6a93d37e002b085034e129cce3556fe91993ac0a337c93b715e3dc9d880", "b35923ec-2d71-4a4a-9536-baf82a51e6f3", 5)
//ioClient.emit('create-wallet', "password1")

ioClient.on('transaction-success', (x) => {
    console.log(x)
})

ioClient.on('new-wallet-data', (x) => {
    console.log("Received Wallet Data: "+x)
    wallet = x
    //ioClient.emit('send-transaction', "008520186ae1bcd571f76fc198cd3f4bb0387dcb1c7453e254442c084798476f", "95ade5e2-d5d3-4f00-ba44-60535e298765", 1)
})

ioClient.on('new-wallet-key', (x) => {
    //console.log("Received Wallet Key: "+x)
})

ioClient.on('error', (x, y) =>{
    console.log("Error Executing Task: "+y+"\nError: "+y)
})