import type { NextFunction, Request, Response } from "express"
import jwt, { type JwtPayload } from 'jsonwebtoken';
import config from "../config";
import { pool } from "../db";
import type { ROLES } from "../types";



const authMiddleware = (...roles: ROLES[]) => {
    
    return async(req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;
            console.log(token);
            if(!token) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized access!!',
                })
            }

            const decode = jwt.verify(token as string, config.secret as string) as JwtPayload;
            
            const userData = await pool.query(`
            SELECT * FROM users
            WHERE email=$1 
            `, [decode.email]
            );
            
            const user = userData.rows[0];

            if(userData.rows.length === 0) {
                res.status(404).json({
                    success: false,
                    message: 'User not found!',
                })
            }

            if(!user.is_active){
                res.status(403).json({
                    success: false,
                    message: 'Forbidden user!',
                })
            }

            if(roles.length && !roles.includes(user.role)){
                res.status(403).json({
                    success: false,
                    message: 'Forbidden user!',
                })
            }

            req.user = decode;
            next();
        } catch (error) {
            next(error);
        }
        console.log(roles);
    }
};

export default authMiddleware;