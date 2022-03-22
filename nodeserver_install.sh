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
clear
echo Ready!
