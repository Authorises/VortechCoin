function createWallet(){
    var pass = document.getElementById('wallet-password').value
    socket.emit('create-wallet', pass)
    swal("Waiting for server...")
}

socket.on('new-wallet-data', (x) => {
    var wal = JSON.parse(x)
    swal("Wallet Created!", 'Here are your details. ( WRITE them down! )\nWallet Key: '+wal.key+"\nWallet Password: "+wal.password+"\nWallet UUID: "+wal.uuid+"\n\nDon't worry, we've logged you in.", "success");
    localStorage.setItem('wallet', JSON.stringify(wal))
    document.getElementById('m').innerHTML=`
    
    <div class="button register" onclick="window.location.replace('../wallet-login')"> Login to your new wallet! </div>
    
    
    
    `
    //socket.emit('send-transaction', "008520186ae1bcd571f76fc198cd3f4bb0387dcb1c7453e254442c084798476f", "95ade5e2-d5d3-4f00-ba44-60535e298765", 1)
})

socket.on('net-shutdown', (x) => {
    swal("Network", 'The main server node has been shut down for reason: '+x, "error");
})