const http = require('http');
const fs = require('fs');
var requests = require("requests");

const homeFile = fs.readFileSync("./home.html", "utf-8");

const replaceVal = (tempVal,orgVal) => {
    let temprature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temprature = temprature.replace("{%tempmin%}", orgVal.main.temp_min);
    temprature = temprature.replace("{%tempvmax%}", orgVal.main.temp_max);
    temprature = temprature.replace("{%location%}", orgVal.name);
    temprature = temprature.replace("{%country%}", orgVal.sys.country);
    temprature = temprature.replace("{%status%}", orgVal.weather[0].main);
    return temprature;
}

const server = http.createServer((req,res) =>{
    if(req.url == "/"){
        requests("https://api.openweathermap.org/data/2.5/weather?q=Rawalpindi&units=metric&appid=f115a2019ee67f91ef48ede394346df9")
            .on('data',  (chunk) =>  {
                const objData = JSON.parse(chunk);
                const arrData = [objData];
                const realTimeData = arrData.map((val) => replaceVal(homeFile,val)).join("");
                res.write(realTimeData);
            })
            .on('end',  (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end();
            });
    }
})

server.listen(8000, "127.0.0.1")