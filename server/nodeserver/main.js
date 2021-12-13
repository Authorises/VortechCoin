const {v4: uuidv4} = require('uuid');
const crypto = require('crypto');
const { randomInt, randomBytes } = require("crypto");
const fs = require('fs')

const express = require('express');
const {Server} = require('socket.io')
const app = express();
const l = app.listen(20183);
const server = new Server(l, { cors: { origin: '*' } });

const datadir = 'data/'

let wallets = new Map();
let walletKeys = new Map()
let shutdownKeys = ["49adbb0d68402a780532a1b1d146f701deba01fbef5d0e16736e1ed99a523ddd", "a82d6fc1a1a4d5c1ff9b99e39aec25046937924cc3dec06113c81e1e7b17a355", "6029a06d0d48a9f27372f44f6945c782abf61748198cbb9059b41aa5de325927"]

function loadData(){
    try {
        const data = fs.readFileSync(datadir+'wallets.txt', 'utf8')
        x = JSON.parse(data)
        for(var value in x){
            wallets.set(value, x[value])
        }
      } catch (err) {
        console.error(err)
      }  
      try {
        const data = fs.readFileSync(datadir+'walletkeys.txt', 'utf8')
        x = JSON.parse(data)
        for(var value in x){
            walletKeys.set(value, x[value])
        }
      } catch (err) {
        console.error(err)
      }  
}

loadData()

function saveData(){
    let walletsJ = {};  
    wallets.forEach((value, key) => {  
        walletsJ[key] = value  
    });  
    fs.writeFile(datadir+'wallets.txt', JSON.stringify(walletsJ), err => {
        if (err) {
            console.error(err);
            return
        }
        console.log('Written wallets.txt');
    })

    let walletKeysJ = {};  
    walletKeys.forEach((value, key) => {  
        walletKeysJ[key] = value  
    });  
    fs.writeFile(datadir+'walletkeys.txt', JSON.stringify(walletKeysJ), err => {
        if (err) {
            console.error(err);
            return
        }
        console.log('Written walletkeys.txt');
    })
}

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
    send(receiver, amount) {
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
//stressTest(100);
//console.log('Done')
server.on("connection", (socket) => {
    socket.emit('devdata', a)
    console.info(`Client connected [id=${socket.id}]`);
    socket.on("disconnect", () => {
        console.info(`Client gone [id=${socket.id}]`);
    });

    // These are all the dev/staff type listeners

    socket.on('get-stats', (key, action) => {
      if(shutdownKeys.indexOf(key) >= 0){
        switch(action){
          case "all":
            // Send all stats ( Wallets, Security, Actions, Sockets )
            break;
          case "wallets":
            // Send wallet stats
            var responseData = new Object()
            responseData.walletsLoaded = wallets.size
            socket.emit('get-stats-response', action, responseData)
            break;
          case "security":
            // Send security stats
            break;
          case "actions":
            // Send actions stats
            break;
          case "sockets":
            // Send sockets stats
            break;
        }
      }else{
        socket.emit('error', 'Request of Statistics ('+action+')', 'Provided Authentication Key does not match server Authentication Keys.')
      }
    })

    socket.on('safe-shutdown', (key, reason) => {
        if(shutdownKeys.indexOf(key) >= 0){
            socket.emit('server-shutdown', 'started')
            console.log('Safe Shutdown!')
            socket.emit('server-shutdown', 'saving-data')
            saveData()
            socket.emit('server-shutdown', 'data-saved')
            console.log('Now Shutting down Node Server')
            socket.broadcast.emit('net-shutdown', reason)
            exit(0);
        }else{
            socket.emit('error', 'Server Shutdown', 'Provided Authentication Key does not match server Authentication Keys.')
        }
    })

    // These are all the client/customer type listeners

    socket.on('get-balance', (user) => {
        if(wallets.has(user)){
            socket.emit('get-balance-result', user, wallets.get(user).balance)
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
saveData()
