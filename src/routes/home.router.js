import { Router } from "express";
const router = Router()
import { home } from "../controllers/home.controller.js"


router.get("/", home)


export default router
