import express from 'express'; // Adding express.js
import dotenv from 'dotenv';  // Adding .env
import fs from 'fs'; // Adding file system.. 

// adding cors for testing/ making HTTP request
import cors from 'cors';
// // Adding postman-collection Which need to be check 
import postman from 'postman';

// Creating a app
const app = express();

app.get("/" , async(req, res) => {

});

// Setting up port 
const server_port = process.env.PORT || 3001 ;

// Setting middleware 

app.use(express.json());
app.use(cors);

