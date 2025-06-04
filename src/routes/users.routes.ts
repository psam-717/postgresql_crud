import express from "express";
import { createUser, login, welcome } from "../controllers/user.controller";
import { validateBody } from "../middlewares/validate.middleware";
import { createUserSchema, loginSchema } from "../validators/user.validation";

const router = express.Router();

router.get('/all', welcome);
router.post('/create', validateBody(createUserSchema) ,createUser);
router.post('/login', validateBody(loginSchema), login)


export default router;