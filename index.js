// Basic Node.js application entry point

console.log('Hello from Node.js!');

// const https = require('https');
// 
// const server = https.createServer((req, res) => {
//     res.write('Welcome to our first secure server!');
//     res.end();
// });
// 
// server.listen(5000)

// Example: Simple HTTP server (uncomment to use)
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World!');
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
