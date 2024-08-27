import express from "express";
import {loginUser, registerUser } from "./authController";


const router= express.Router()

router.route("/auth/register",).post(registerUser)
router.route("/auth/login").post(loginUser)

export default router;