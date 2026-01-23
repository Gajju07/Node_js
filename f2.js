// Event loop example

console.log('Start');

setTimeout (() => {
  console.log('Second output and the timer is set to 1 ')
} , 1);

console.log('End');

// Setting up the server and displaying output

const http = require('http'); // Don't forget to import http!

console.log('Start');

const lineBreak = `<br>`;

const server = http.createServer((req, res) => {
  console.log('Start');

  // 1. Set the timer inside the request handler
  setTimeout(() => {
    console.log('Timer finished! Sending response now.');

    // THE FIX: Tell the browser this is an HTML document
    res.writeHead(200, { 'Content-Type': 'text/html' });

    // Using your lineBreak variable inside backticks
    res.write(`Second output and the timer is set to 1 second ${lineBreak}`);
    //  res.write('Hello from f2.js after a 1-second delay!');
    res.end('Hello from f2.js after a 1-second delay!');
  }, 1000);

  console.log('End');
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

console.log('End');