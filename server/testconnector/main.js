const
    io = require("socket.io-client"),
    ioClient = io.connect("http://localhost:20183");

var a;
var wallet;

//ioClient.emit('send-transaction', "aca87f51685ee3bbbf74c22ba08dbb31d187b46bf9cabe252e7b4e4fe0aaedb0", "380ab9f9-6dfe-48c1-b57e-c9d788dddd6c", 4)
//ioClient.emit('create-wallet', "password1")
//ioClient.emit('get-balance', '9b6a2029-24d1-4336-804c-bd6ee919156e')
//ioClient.emit('safe-shutdown', 'a82d6fc1a1a4d5c1ff9b99e39aec25046937924cc3dec06113c81e1e7b17a355', 'You are under arrest')
ioClient.emit('get-stats', 'a82d6fc1a1a4d5c1ff9b99e39aec25046937924cc3dec06113c81e1e7b17a355a', 'wallets')

ioClient.on('net-shutdown', (x) => {
    console.log('Network: The main server node has been shut down for reason: '+x)
})

ioClient.on('server-shutdown', (x) =>{
    console.log('TASK: SERVER SHUTDOWN; STATUS: '+x)
})

ioClient.on('get-balance-result', (x,y) => {
    console.log('Get Balance Result for '+x+' is '+y)
})

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