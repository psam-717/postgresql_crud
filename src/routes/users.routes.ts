import express from "express";
import { createUser, login, profileData, welcome } from "../controllers/user.controller";
import { validateBody } from "../middlewares/validate.middleware";
import { createUserSchema, loginSchema } from "../validators/user.validation";
import { authenticateToken } from "../middlewares/authorization";

const router = express.Router();

router.get('/all', welcome);
router.post('/create', validateBody(createUserSchema) ,createUser);
router.post('/login', validateBody(loginSchema), login);
router.get('/me', authenticateToken, profileData);


export default router;