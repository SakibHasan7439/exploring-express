import express, { type Application, type Request, type Response } from 'express'
import {Pool} from 'pg'
import config from './config';

const app: Application = express();
const port = config.port;

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({extended: true}));

const pool = new Pool({
    connectionString: config.connection_string
});

const initDB = async() => {
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

initDB();

app.get('/user', (req: Request, res: Response) => {
  res.status(200).json({
    "message": "Express server is running!",
    "author": "Sakib Hasan"
  })
})

// create an user
app.post('/users', async(req: Request, res: Response) => {
    const {name, age, department, email, password} = req.body;

    try {
        const result = await pool.query(`
            INSERT INTO users(name, age, department, email, password) VALUES($1,$2,$3,$4, $5)
            RETURNING *
        `, [name, age, department, email, password]);

        console.log(result);

        res.status(201).json({
            message: "created successfully",
            data: result.rows[0]
        })

    } catch (error: any) {
        res.status(500).json({
            message: error.message,
            data: error
        })
    }
})

// get all data
app.get('/users', async(req: Request, res:Response) => {
    try {
        const result = await pool.query(`
            SELECT * FROM users
        `)
        res.status(200).json({
            success: true,
            message: 'Data fetched successfully',
            data: result.rows
        })

    } catch (error:any) {
        res.status(500).json({
            message: error.message,
            data: error
        })
    }
})

// get single user
app.get('/users/:id', async(req: Request, res: Response) => {
    const {id} = req.params;
    
    try {
        const result = await pool.query(`
            SELECT * FROM users WHERE id = ${id}    
        `);

        if(result.rows.length === 0){
            res.status(404).json({
                success: false,
                message: 'Data not found!'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Data fetched successfully',
            data: result.rows
        })

    } catch (error:any) {
        res.status(500).json({
            message: error.message,
            data: error
        })
    }
});

// update an user
app.put('/users/:id', async(req: Request, res: Response) => {
    const {id} = req.params;
    const {name, age, password, is_active, department} = req.body;

    try {
        const result = await pool.query(`
            UPDATE users 

            SET name=COALESCE($1, name),
            age=COALESCE($2, age),
            password=COALESCE($3, password),
            is_active=COALESCE($4, is_active),
            department=COALESCE($5, department)

            WHERE id = $6 
            RETURNING *
        `, [name, age, password, is_active, department, id]);

        if(result.rows.length === 0){
            res.status(404).json({
                success: false,
                message: 'Data not found!'
            })
        }

        res.status(200).json({
            success: true,
            message: 'updated successfully',
            data: result.rows
        })
    } catch (error: any) {
        res.status(500).json({
            message: error.message,
            data: error
        })
    }

    
})

// delete an user
app.delete('/users/:id', async(req: Request, res: Response) => {
    const {id} = req.params;

    try {
        const result = await pool.query(`
           DELETE FROM users
           WHERE id = ${id} 
        `);

        if(result.rows.length === 1) {
            res.status(404).json({
                message: "user not found!",
                data: {}
            })
        }

        res.status(200).json({
            success: true,
            message: "user deleted successfully",
            data: result.rows
        })
    } catch (error:any) {
        res.status(500).json({
            message: error.message,
            data: error
        })
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
