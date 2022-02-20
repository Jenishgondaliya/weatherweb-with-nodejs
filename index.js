const http = require('http');
const fs = require('fs')
var requests = require('requests')

const homefile = fs.readFileSync("home.html", "utf8");

const replaceVal = (tempval, orgval) => {
    let tempar = tempval.replace("{%tempval%}", orgval.main.temp)
    tempar = tempar.replace("{%tempmin%}", orgval.main.temp_min)
    tempar = tempar.replace("{%tempmax%}", orgval.main.temp_max)
    tempar = tempar.replace("{%location%}", orgval.name)
    tempar = tempar.replace("{%country%}", orgval.sys.country)
    tempar = tempar.replace("{%tempstatus%}", orgval.weather.main)
    return tempar;
}





const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests(`https://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=2c93ab5a7a091f9c5c77cf4423d6358f`)
            .on("data", (chunk) => {
                const objdata = JSON.parse(chunk)
                const arrdata = [objdata];
                // console.log(objdata.main.temp);
                const realtimedata = arrdata.map((val) =>  replaceVal(homefile, val))
                .join();
               


               
                 res.write(realtimedata)
                // console.log(realtimedata);
            })
            .on("end", (err) => {
                if (err) return console.log('connection closed due to errors', err);

                res.end();
            });
    }
})
server.listen(8000, "127.0.0.1");