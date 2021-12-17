const socket = io("http://localhost:20183");
var currentWallet;

socket.on('get-stats-response', (x, y) =>{
    console.log('Get-Stats response for request: '+x+' is: '+JSON.stringify(y))
})

socket.on('server-shutdown', (x) =>{
    console.log('TASK: SERVER SHUTDOWN; STATUS: '+x)
})

socket.on('get-balance-result', (x,y) => {
    console.log('Get Balance Result for '+x+' is '+y)
})

socket.on('transaction-success', (x) => {
    console.log(x)
})

socket.on('new-wallet-key', (x) => {
    //console.log("Received Wallet Key: "+x)
})

socket.on('error', (x, y) =>{
    swal("Error: "+x, y, "error");
    console.log("Error Executing Task: "+y+"\nError: "+y)
})