# VortechCoin - An Open source, but centralized "CryptoCurrency"

###### This is my first JavaScript project.

# Instructions to Deploy Node Server
##### Node Server handles balances, transactions, e.t.c. and it is how clients interact. Currently its not setup to use a db (Upwards scaling only for now :| )but I am planning to add MongoDB Integration.


#### The NodeServer is inside of ```/server/nodeserver```. The data is stored in the folder named ```data```.

## Prequisites to run:
#### To run the Node Server you will first need the following installed:
* NodeJS 14.17.1 or above
* NPM 6.14.15 or above
* And obviously if you wish people to connect to it from the outside world you need an IP address.
## Install needed packages:
#### You can install all the needed paclages needed for the nodeserver by running:
```sudo npm install uuid crypto fs express socket.io dotenv mongodb```
## Test it
#### Now test everything is working properly by running the ```run.sh``` which starts the node server:
#### Note: You will need to give the ```run.sh``` file permission by running ```sudo chmod u+x run.sh``` You can run the nodeserver without run.sh by running the command ```node .```, but I prefer to have a script to start it.
* ```sudo chmod u+x run.sh```
* ```./run.sh```
## Now you will need to configure the Node Server.

### Optional Configuration
* You can change the port socket.io listens to at line 9 (```const l = app.listen(20183);```)
* You can change the directory the node server saves and reads data from at line 12 (```const datadir = 'data/'```)
* You can change the mining difficulty at line 13 (```const miningDifficulty = 100000```)
### Needed Configuration
* You must change the Shutdown Keys at line 16 (```let shutdownKeys = [""]```)

# Instructions to configure frontend: web-wallet

[![Screenshot-2022-03-13-20-12-15.png](https://i.postimg.cc/N0kw4Cbc/Screenshot-2022-03-13-20-12-15.png)](https://postimg.cc/06j35fLW)

#### The web-wallet is where most users will interact with the service. Of course, as the front end and the way it interacts with the backend is accessible to users, customised frontends will be made, but this is the default.
#### The frontend code is inside of ```/client/web-wallet``` and can be ran "Out of the box", however it does still need configuration.

## Configuring the web-wallet:
#### You will need to enter the directory ```/client/web-wallet``` and edit the file ```index.js```.

### Needed Configuration:
  * You need to change the ip and port of line 1 (```const socket = io("http://localhost:20183");```) to the ip and port of the node server you setup previously. By default the port is ```20183```. You will need the ip of the node server to be accessible externally if you want users of the web wallet outside of your network able to interact with the node server.
#### That's it for the web-wallet, now you can configure the miner so people can earn your currency.

# Instructions to configure frontend: miner

[![Screenshot-2022-03-13-20-10-21.png](https://i.postimg.cc/fWBRZycN/Screenshot-2022-03-13-20-10-21.png)](https://postimg.cc/23LD7z9c)

#### The miner is where users will earn your currency. It is designed to act like most proof of work algorithms that work well with GPU's and you will get a similar hashrate on here to normal gpu mining, although the difficulty can be easily configured in earlier steps. Obviously as this currency is **Centralized** and not **Decentralized** there is actually no need for mining, although it makes the experience more "Realistic" and also gives users an actual way to earn it.

* All you need to change for the miner, is line 3 (```    socket = io.connect("http://localhost:20183");```) to the nodeserver ip and port that you wish to use.
