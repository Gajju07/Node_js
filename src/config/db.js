import pkg from 'pg';

const {Pool} = pkg;

const pool = new Pool {
    user : process.env.user,
    
}