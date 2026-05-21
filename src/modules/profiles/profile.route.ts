import { Router } from "express";
import { profileController } from "./profile.controller.js";

const router = Router();

router.post('/', profileController.createProfile);
router.get('/', profileController.getProfiles);

export const profileRoute = router;