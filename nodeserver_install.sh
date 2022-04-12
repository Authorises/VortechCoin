clear
echo This script assumes you have NPM and NodeJS installed at latest version, if you do not, CTRL + C out in the next 5 seconds.
sleep 5
echo Starting...
clear
echo Cloning Authorises/VortechCoin
git clone https://github.com/Authorises/VortechCoin
cd VortechCoin
clear
echo Deleting code that will not be used
ls
rm -rf templates client
ls
rm .replit package-lock.json readme.md
ls
cd server
ls
rm -rf testconnector
ls
cd nodeserver
clear
echo Starting configuration now.
sleep 1
clear
read -p "Enter port clients should connect to : " port
sed -i 's/20183/${$port}/' main.js
clear
echo Installing needed nodejs packages!
npm i uuid crypto fs express socket.io dotenv mongodb
red -p "Enter the directory data should be stored in : " datadir
sed -i "s/'data/'/'${$datadir}'"
clear
