import express from "express";
import { createUser, welcome } from "../controllers/user.controller";

const router = express.Router();

router.get('/all', welcome);
router.post('/create', createUser);


export default router;