console.log(localStorage)
var currentWallet;

function reload(){
  location.reload()
}

function isInt(value) {
  return !isNaN(value) && 
         parseInt(Number(value)) == value && 
         !isNaN(parseInt(value, 10));
}

function w_trans(){
    swal({
        title: 'Transaction',
        text: 'Enter the Address ( Wallet UUID ) that you wish to send funds to.',
        content: "input",
        button: {
          text: "Next",
          closeModal: false,
        },
      })
      .then(address => {
        if (!address){
          swal("Transaction Failed", "You need to enter an address to send funds to!", "error");
        }else{
          swal("Waiting for the server...")
          socket.emit('trans', 's1', currentWallet.key, address, null)
        }
      })
      .catch(err => {
        if (err) {
          swal("Transaction Failed", "Try Again or contact staff.", "error");
        } else {
          swal.stopLoading();
          swal.close();
        }
      });
}

function wwm(){
    if(localStorage.getItem('wallet') !== null){
        var x = JSON.parse(localStorage.getItem('wallet'))
        socket.emit('login', 'w', x.key, x.password);
        console.log(x.key)
        console.log(x.password)
    }else{
        swal("Error: w-err-ls-w", "This error is most likely due to opening the page\nwithout creating a wallet!", "error");
    }
}

function logout(){
  localStorage.removeItem('wallet')
  window.location.replace('../')
}

socket.on('f-reload', () =>{
  reload()
})

socket.on('trans', (x,y) => {
  if(x=="success"){
    swal("Transaction Complete", "You sent "+x+" to "+y, "success");
  }
  if(x=="s2"){
    swal({
      title: 'Transaction',
      text: 'Enter how much funds you would like to send to\n'+y,
      content: "input",
      button: {
        text: "Next",
        closeModal: false,
      },
    })
    .then(amount => {
      if (!amount){
        swal("Transaction Failed", "You need to enter an amount to send!", "error");
      }else{
        if(isInt(amount)){
          if(amount > 0){
            if(currentWallet.balance >= amount){
              swal("Waiting for the server...")
              socket.emit('trans', 's3', currentWallet.key, amount, y)
            }else{
              swal("Transaction Failed", "You do not have sufficient funds!", "error");
            }
          }else{
            swal("Transaction Failed", "You must enter a positive number!", "error");
          }
        }else{
          swal("Transaction Failed", "You need to enter a number!", "error");
        }
      }
    })
    .catch(err => {
      if (err) {
        swal("Transaction Failed", "Try Again or contact staff.", "error");
      } else {
        swal.stopLoading();
        swal.close();
      }
    });
  }
})

socket.on('login', (t, x) => {
    if(t=='w'){
        currentWallet = x;
        //swal("Authenticated", "Wallet UUID: "+x.uuid+"\nYou can now use the Web Wallet", "success");
        document.getElementById('wallet-uuid').value = x.uuid
        console.log(x.balance)
        document.getElementById('bal').innerHTML = "Balance: "+x.balance
    }
})

socket.on('net-shutdown', (x) => {
  swal("Network", 'The main server node has been shut down for reason: '+x, "error");
})

socket.on('server-shutdown', (x) =>{
    console.log('TASK: SERVER SHUTDOWN; STATUS: '+x)
})

socket.on('get-balance-result', (x,y) => {
    console.log('Get Balance Result for '+x+' is '+y)
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