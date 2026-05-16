import {Pool} from 'pg'
import config from "../config";

export const pool = new Pool({
    connectionString: config.connection_string
});

export const initDB = async() => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
                id SERIAL PRIMARY KEY,
                name VARCHAR(20),
                age INT,
                department VARCHAR(10),
                email VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(10) NOT NULL,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW() 
            )    
        `)

        console.log("DB connected successfully");

    } catch (error) {
        console.log(error);
    }
};