import express from "express";
import { welcome } from "../controllers/user.controller";

const router = express.Router();

router.get('/all', welcome)


export default router;