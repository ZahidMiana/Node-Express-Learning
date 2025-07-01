const http = require ('http');
const fs = require ('fs');
const url = require ('url');

const myServer = http.createServer((req, res) => {
    if(req.url === "/favicon.ico") return res.end();

    const log = `${Date.now()}: ${req.url} New Req Recieved \n`;
    const myUrl = url.parse(req.url, true);
    console.log(myUrl);

    fs.appendFile('log1.txt',log, (err, data) => {
        switch(req.url) {
            case '/':
            if(req.method === "GET") res.end("Jome Page");
            break;

            case '/about':
            const username = myUrl.query.myname;
            res.end (`Hi,  ${username}`);
            break;
            
            case '/search':
                const search = myUrl.query.myname;
                res.end("Here are your result for " + search);
                break;

            case 'signup':
                if(req.method === 'GET') res.end("This is Signup Form");
                else if (req.method === 'POST'){
                    res.end("Success!");
                }
            default:
            res.end("404 Not Found");
        }
    });
});

myServer.listen(8000, () => console.log("Server Started"));