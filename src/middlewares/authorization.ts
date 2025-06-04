import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const authenticateToken = async(req: Request, res: Response, next: NextFunction) :Promise<void> => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader?.split(' ')[1];

        if(!token){
            res.status(401).json({error: 'Access token required'});
            return;
        }
        if(!process.env.JWT_SECRET){
            res.status(401).json({error: 'Jwt not set'});
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as {id: string, email: string};

        if(!decoded || !decoded.id || !decoded.email){
            res.status(401).json({error: 'Invalid token payload'});
            return;
        }

        (req as any).user = {
            id: decoded.id,
            email: decoded.email
        }
        next()
        
    } catch (error) {
        console.log('Error caused by ', (error as Error).stack);
        if(error instanceof JsonWebTokenError){
            res.status(500).json({error: 'Json web token error'});
            return;
        }else if (error instanceof TokenExpiredError){
            res.status(500).json({error: 'Token is expired'});
            return;
        }
        res.status(500).json({error: 'Internal server error while'});
        return;
    }
}