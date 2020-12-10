const fs = require('fs');

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;
    if (url === '/') {
        res.write('<html>');
        res.write('<head><title>Log</title></head>');
        res.write('<body><label for="message">Log your message</label><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>');
        res.write('</html>');
        //Don't forget to return! Else code will keep running when IF was met.
        return res.end();
    }

    if (url === '/message' && method === 'POST') {
        const body = [];
        req.on('data', (messages) => {
            body.push(messages);
        });
        //Convert the buffer to string to save it to file
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            //message='message' becomes 'message' in txt file
            const message = parsedBody.split('=')[1];
            fs.writeFile('messages.txt', message, err => {
                res.statusCode = 302;
                res.setHeader('Location', '/')
                return res.end();
            });
        });
    }
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>Message to File</title></head>');
    res.write('<body><h1>Hello from my Node.js Server!</h1></body>');
    res.write('</html>');
    res.end();
};

module.exports = {
    handler: requestHandler
}