const http = require("http")
const port = 7000
const fs = require("fs")
const querystring = require("querystring");

let biodata = [
    { name: 'Jono', age: 25, dateOfBirth: '1995-01-01' },
    { name: 'Jadi', age: 22, dateOfBirth: '1998-02-02' }
]

http
    .createServer((req, res) => {
        switch (req.url) {
            case "/":
                req.url = "landing.html"
                break;
            case "/form":
                if (req.method === "GET") {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(biodata));
                } else if (req.method === "POST") {
                    let requestBody = '';
                    req.on('data', (data) => {
                        requestBody += data;
                    });
                    req.on('end', () => {
                        const formData = querystring.parse(requestBody);
                        biodata.push(formData);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(biodata));
                    });
                } else if (req.method === "PUT") {
                    let requestBody = '';
                    req.on('data', (data) => {
                        requestBody += data;
                    });
                    req.on('end', () => {
                        const updateData = JSON.parse(requestBody);
                        const nameToUpdate = updateData.name.toLowerCase();
                        const newData = { ...updateData };
                        const index = biodata.findIndex(item => item.name.toLowerCase() === nameToUpdate);
                        if (index !== -1) {
                            biodata[index] = newData;
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(biodata));
                        } else {
                            res.writeHead(404, { 'Content-Type': 'text/plain' });
                            res.end('Data not found');
                        }
                    });
                } else if (req.method === "DELETE") {
                    let requestBody = '';
                    req.on('data', (data) => {
                        requestBody += data;
                    });
                    req.on('end', () => {
                        const deleteData = JSON.parse(requestBody);
                        const nameToDelete = deleteData.name.toLowerCase(); 
                        const index = biodata.findIndex(item => item.name.toLowerCase() === nameToDelete); 
                        if (index !== -1) {
                            biodata.splice(index, 2); 
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(biodata));
                        } else {
                            res.writeHead(404, { 'Content-Type': 'text/plain' });
                            res.end('Data not found');
                        }
                    });
                } else {
                    res.writeHead(405, { 'Content-Type': 'text/plain' });
                    res.end('Method Not Allowed');
                }
                return;
            default:
                break
        }
        let path = `./src/public/${req.url}`
        fs.readFile(path, (err, data) => {
            res.writeHead(200)
            res.end(data)
        })
    })
    .listen(port, "localhost", () => console.log(
        `server running at http://localhost:${port}/`))