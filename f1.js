// Improvise version of index 

const http = require('http');

const server = http.createServer((req, res) => {
    // We are using if statement 
    if (req.url == '/') {
        res.end("Welcome to our Node Js home page")
    }
    // Adding a about url
    if (req.url == '/about') {
        res.end("Welcome to about page")
    }
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});

// Trying node f1.js in the terminal by typing node f1.js