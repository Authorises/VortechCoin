
const {Server} = require("socket.io");
const server = new Server(20183);
const {v4: uuidv4} = require('uuid');
const crypto = require('crypto');
const { randomInt, randomBytes } = require("crypto");
const e = require("cors");

let wallets = new Map();
let walletKeys = new Map()

class Wallet {
    constructor(password) {
        this.password = crypto.createHash('sha256').update(password).digest('hex');
        this.uuid = uuidv4();
        this.transactions = [];
        this.balance = 0;
        this.key = this.getCredHash();
        wallets.set(this.uuid, this)
        walletKeys.set(this.key, this)
    }
    getCredHash() {
        return crypto.createHash('sha256').update(this.uuid+":v:"+this.password+randomInt(100000)).digest('hex');
    }
    setBalance(balance) {
        this.balance = balance;
    }
    send(receiver /** This is a UUID */, amount) {
        if(amount > this.balance){
            return false;
        }else{
            if(wallets.has(receiver)){
                this.balance -= amount;
                var receiver = wallets.get(receiver)
                receiver.balance += amount;
                var transaction = new Transaction(this.uuid, receiver.uuid, amount)
                receiver.transactions.push(transaction);
                this.transactions.push(transaction);
                return transaction;
            }else{
                return false;
            }
        }
    }
}

class Transaction{
    constructor(sender, receiver, amount) {
        this.sender = sender; 
        this.receiver = receiver; 
        this.amount = amount;
        this.id = uuidv4()
    }
    getData(){
        return JSON.stringify(this);
    }
}

a = new Wallet("password1")

console.log(walletKeys)
/** 
a.setBalance(10)
b = new Wallet("password1")
c = new Wallet("password1")
a.send(b.uuid, 1)
a.send(b.uuid, 1)
a.send(b.uuid, 1)
a.send(b.uuid, 1)
a.send(b.uuid, 1)
a.send(b.uuid, 1)
a.send(b.uuid, 1)
a.send(b.uuid, 1)
a.send(b.uuid, 1)
a.send(b.uuid, 1)
a.send(b.uuid, 1)
console.log(a.transactions)
console.log(b.transactions)
// console.log("Server Started (20183)")
*/
function stressTest(difficulty){
    var saccount = new Wallet("Test")
    var x = difficulty*1000
    var y = difficulty*1
    console.log('Stress Testing System with Difficulty '+difficulty+":\n- "+x+' Accounts which make:\n  - '+y+' Transfers')
    setTimeout(() => {console.log('Beginning')}, 5000);
    while(x>0){
        x-=1;
        a = new Wallet("test")
        a.setBalance(y)
        while(a.balance>0){
            a.send(saccount.uuid, 1)
        }
    }
}
stressTest(100);
console.log('Done')
server.on("connection", (socket) => {
    socket.emit('devdata', a)
    console.info(`Client connected [id=${socket.id}]`);
    socket.on("disconnect", () => {
        console.info(`Client gone [id=${socket.id}]`);
    });
    socket.on('get-balance', (user) => {
        if(wallets.has(user)){
            socket.emit('get-balance-result', wallets.get(user).balance)
        }else{
            socket.emit('error', 'Getting the balance of a user', 'That UUID does not exist.')
        }
    })
    socket.on('create-wallet', (password) =>{
        var wallet = new Wallet(password);
        wallet.setBalance(5)
        socket.emit('new-wallet-data', JSON.stringify(wallet))
        socket.emit('new-wallet-key', wallet.key)
        //console.log(walletKeys)
    })
    socket.on('send-transaction', (walletKey, receiver, amount) =>{
        //console.log(walletKeys)
        //console.log("============================\nTransaction Attempted\nWallet Key: "+walletKey+"\nReceiver: "+receiver+"\nAmount: "+amount+"\n============================")
        if(walletKeys.has(walletKey)){
            var wallet = walletKeys.get(walletKey);
            if(wallet.uuid != receiver){
                var x = wallet.send(receiver, amount)
                if(x){
                    socket.emit('transaction-success', x)
                    //console.log("============================\nTransaction Accepted\nWallet Key: "+walletKey+"\nReceiver: "+receiver+"\nAmount: "+amount+"\n============================")
                    //console.log(walletKeys)
                }else{
                    socket.emit('error', 'Sending Transaction', 'Invalid Amount or Receiver Entered')
                }
            }else{return false}
        }else{
            socket.emit('error', 'Sending Transaction', 'Invalid Key Provided')
        }
    });
});
