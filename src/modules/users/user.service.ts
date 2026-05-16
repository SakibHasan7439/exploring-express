import { pool } from "../../db";
import type { IUser } from "./user.interface";

const createUserIntoDB = async (payload: IUser) =>{
    const { name, age, department, email, password } = payload;
    const result = await pool.query(`
        INSERT INTO users(name, age, department, email, password) VALUES($1,$2,$3,$4, $5)
        RETURNING *
    `, [name, age, department, email, password]);

    return result;
};

const getUsersFromDB = async() => {
    const result = await pool.query(`
        SELECT * FROM users
    `);

    return result;
}

const getSingleUserFromDB = async(id:string) =>{
    const result = await pool.query(`
        SELECT * FROM users WHERE id = ${id}    
    `);

    return result;
}

const updateUserIntoDB = async(payload: IUser, id:string) => {
    const { name, age, is_active, department, password } = payload;
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

    return result;

}

const deleteUserFromDB = async(id:string) => {
    const result = await pool.query(`
        DELETE FROM users
        WHERE id = ${id} 
    `);

    return result;
}

export const userService = {
    createUserIntoDB,
    getUsersFromDB,
    getSingleUserFromDB,
    updateUserIntoDB,
    deleteUserFromDB
}