import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../../db";
import config from "../../config";


const loginUserIntoDB = async(payload: {email: string, password: string}) => {
    const {email, password} = payload;
    const result = await pool.query(`
       SELECT * FROM users
       WHERE email=$1 
    `, [email]);

    if(result.rows.length === 0) {
        throw new Error("User not found");
    }

    const user = result.rows[0];
    const matchPassword = await bcrypt.compare(password, user.password);

    if(!matchPassword){
        throw new Error("Invalid password!");
    };

    // Generate JWT
    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        is_active: user.is_active
    };

    const accessToken = jwt.sign(jwtPayload, config.secret as string, {
        expiresIn: '1d'
    });
    return {accessToken};
};

export const authService = {
    loginUserIntoDB
}