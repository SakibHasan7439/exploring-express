import bcrypt from "bcryptjs";
import jwt, { type JwtPayload } from "jsonwebtoken";
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
        role: user.role,
        is_active: user.is_active
    };

    const accessToken = jwt.sign(jwtPayload, config.secret as string, {
        expiresIn: '1d'
    });

    const refreshToken = jwt.sign(jwtPayload, config.refresh_secret as string, {
        expiresIn: '90d'
    })
    return {accessToken, refreshToken};
};

const generateRefreshToken = async(token: string) => {
    // const token = req.headers.authorization;
    console.log(token);
    if(!token) {
        throw new Error("Unauthorized access!!")
    }

    const decode = jwt.verify(token as string, config.refresh_secret as string) as JwtPayload;
    
    const userData = await pool.query(`
        SELECT * FROM users
        WHERE email=$1 
        `, [decode.email]
    );
    
    const user = userData.rows[0];

    if(userData.rows.length === 0) {
        throw new Error("User not found!")
    }

    if(!user.is_active){
        throw new Error("Forbidden User!!")
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_active: user.is_active
    };

    const accessToken = jwt.sign(jwtPayload, config.secret as string, {
        expiresIn: '1d'
    });

    return {accessToken};
}

export const authService = {
    loginUserIntoDB,
    generateRefreshToken
}