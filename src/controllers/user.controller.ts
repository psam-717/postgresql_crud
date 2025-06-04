import { PrismaClient } from "../generated/prisma";
import { Request, Response } from "express"
import bcrypt from 'bcrypt'
import { createUserSchema, loginSchema } from "../validators/user.validation";
import { ValidatedRequest } from "../middlewares/validate.middleware";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


const prisma = new PrismaClient();

export const welcome = async (req: Request, res: Response): Promise<void> => {
    try {
        
        res.status(200).json({message: 'Welcome to backend'})
        return;

    } catch (error) {
        console.log('Error caused by: ', (error as Error).stack);
        res.status(500).json({message: 'Error occurred while getting all orders'});
        return;
    }
}

export const createUser = async (req: ValidatedRequest<typeof createUserSchema>, res: Response): Promise<void> => {
    try {
        const {firstName, lastName, email, password, phone, location} = req.body;
        
        //make sure user does not exist
        const existingUser = await prisma.customer.findFirst({
            where: {
                OR: [{email}, {phone}]
            }
        });

        if(existingUser){
            if(existingUser.email === email){
                res.status(400).json({error: 'User with this email already exists'});
                return;
            }
            if(existingUser.phone === phone){
                res.status(400).json({error: 'User with phone number already exists'});
                return;
            }
        }

        const hashedPassword = await bcrypt.hash(password,10);
        //create user
        const newUser = await prisma.customer.create({
           data: {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone,
            location
            }

        })
        res.status(201).json({message: 'User created successfully ', user: newUser});
        return

    } catch (error) {
        console.log('Error caused by ', (error as Error).stack);
        res.status(500).json({message: 'Internal server error while creating new user'});
        return;
    }
}




export const login = async(req: ValidatedRequest<typeof loginSchema>, res: Response):Promise<void> => {
    try {
        const {email, password} = req.body;

        const exitingUser = await prisma.customer.findUnique({
            where: {
                email: email
            }
        })

        if(!exitingUser){
            res.status(404).json({error: 'User not found'});
            return;
        }

        //compare password
        const isMatch = await bcrypt.compare(password, exitingUser.password);
        if(!isMatch){
            res.status(403).json({error: 'Password is incorrect'});
            return;
        }

        const token = jwt.sign(
            {id: exitingUser.id, email: exitingUser.email},
            process.env.JWT_SECRET as string,
            {expiresIn: '1h'}
        );

        const {password: _, ...userWithoutPassword} = exitingUser;
        res.status(200).json({
            message: 'Logged in successfully',
            token,
            user: userWithoutPassword
            
        })
        
    } catch (error) {
        console.log('Error caused by ', (error as Error).stack);
        res.status(500).json({message: 'Internal server error while logging in'});
        return
    }
} 


export const profileData = async(req: Request, res: Response): Promise<void> => {
    try {
        const existingUser = await prisma.customer.findUnique({
            where: {
                id: (req as any).user.id
            }
        })
        
        if(!existingUser){
            res.status(404).json({error: 'User not found'});
            return;
        }

        const {password: _, ...userWithoutPassword} = existingUser;
        res.status(200).json({
            message: 'Profile retrieved',
            user: userWithoutPassword
        })
    } catch (error) {
        console.log('Error caused by ', (error as Error).stack);
        res.status(500).json({error: 'Internal server error while retrieving profile'});
        return;
    }
}