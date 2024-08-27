import express from "express";
import { getProfile} from "./authController";

const router= express.Router()

router.get('/auth/profile',getProfile);

export default router