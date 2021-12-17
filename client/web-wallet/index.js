const socket = io("http://localhost:20183");
var currentWallet;
function login(){
    socket.emit('login', 'l', document.getElementById("v-s-k").value, document.getElementById("v-s-p").value)
}
//socket.emit('get-stats', 'a82d6fc1a1a4d5c1ff9b99e39aec25046937924cc3dec06113c81e1e7b17a355', 'wallets')
//socket.emit('create-wallet', 'test')

socket.on('login', (t, x) => {
    if(t=='l'){
        currentWallet = x;
        swal("Logged In!", "Wallet UUID: "+x.uuid+"\nYou will be sent to the Wallet Menu in 2 seconds.", "success");
        setTimeout(() => {  window.location.replace("../wallet-main") }, 2000);
        localStorage.setItem('wallet', JSON.stringify(x))
    }
})

socket.on('get-stats-response', (x, y) =>{
    console.log('Get-Stats response for request: '+x+' is: '+JSON.stringify(y))
})

socket.on('net-shutdown', (x) => {
    console.log('Network: The main server node has been shut down for reason: '+x)
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

socket.on('new-wallet-data', (x) => {
    console.log("Received Wallet Data: "+x)
    wallet = x
    //socket.emit('send-transaction', "008520186ae1bcd571f76fc198cd3f4bb0387dcb1c7453e254442c084798476f", "95ade5e2-d5d3-4f00-ba44-60535e298765", 1)
})

socket.on('new-wallet-key', (x) => {
    //console.log("Received Wallet Key: "+x)
})

socket.on('error', (x, y) =>{
    swal("Error: "+x, y, "error");
    console.log("Error Executing Task: "+y+"\nError: "+y)
})