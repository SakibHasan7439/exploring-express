import type { Request, Response } from "express";
import { profileService } from "./profile.service.js";

const createProfile = async(req:Request, res:Response) => {
    try {
        const result = await profileService.createProfileIntoDB(req.body);
        res.status(201).json({
            message: "profile created successfully",
            data: result.rows[0]
        })
    } catch (error:any) {
        res.status(500).json({
            success: false,
            message: error.message,
            data: error
        })
    }
};

const getProfiles = async(req:Request, res: Response) => {
    const result = await profileService.getProfilesFromDB();
    try {
        res.status(200).json({
            success: true,
            message: 'Data fetched successfully',
            data: result.rows
        })

    } catch (error:any) {
        res.status(500).json({
            success:false,
            message: error.message,
            data: error
        })
    }
}

export const profileController = {
    createProfile,
    getProfiles
}