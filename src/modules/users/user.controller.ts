import type { Request, Response } from "express";
import { userService } from "./user.service";
import sendResponse from "../../utility/sendResponse";

const createUser = async(req: Request, res: Response) => {
    try {
        const result = await userService.createUserIntoDB(req.body);
        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "created successfully",
            data: result.rows[0]
        })

    } catch (error: any) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error: error
        })
    }
};

const getUsers = async(req: Request, res:Response) => {
    console.log(req.user);
    try {
        const result = await userService.getUsersFromDB();
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
}

const getSingleUser = async(req: Request, res: Response) => {
    const {id} = req.params;
    
    try {
        const result = await userService.getSingleUserFromDB(id as string);

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
}

const updateUser = async(req: Request, res: Response) => {
    const {id} = req.params;
    try {
        const result = await userService.updateUserIntoDB(req.body, id as string);

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

    
}

const deleteUser = async(req: Request, res: Response) => {
    const {id} = req.params;
    try {
        const result = await userService.deleteUserFromDB(id as string);
        console.log(result);
        if(result.rowCount === 0) {
            return res.status(404).json({
                message: "user not found!",
                data: {}
            })
        }

        return res.status(200).json({
            success: true,
            message: "user deleted successfully",
            data: result.rows
        })
    } catch (error:any) {
        return res.status(500).json({
            message: error.message,
            data: error
        })
    }
}

export const userController = {
    createUser,
    getUsers,
    getSingleUser,
    updateUser,
    deleteUser
}
