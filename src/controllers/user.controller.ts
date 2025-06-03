import { PrismaClient } from "../generated/prisma";
import { Request, Response } from "express"
import bcrypt from 'bcrypt'

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

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const {firstName, lastName, email, password, phone, location} = req.body;

        if(!firstName || !lastName || !email || !password || !phone || !location){
            res.status(400).json({message: 'All fields should be provided'})
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