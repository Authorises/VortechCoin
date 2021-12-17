if(localStorage.getItem('wallet') !== null){
    window.location.replace('../wallet-main')
}

function login(){
    socket.emit('login', 'l', document.getElementById("v-s-k").value, document.getElementById("v-s-p").value)
}

socket.on('login', (t, x) => {
    if(t=='l'){
        currentWallet = x;
        swal("Logged In!", "Wallet UUID: "+x.uuid+"\nYou will be sent to the Wallet Menu in 2 seconds.", "success");
        setTimeout(() => {  window.location.replace("../wallet-main") }, 2000);
        localStorage.setItem('wallet', JSON.stringify(x))
    }
})
