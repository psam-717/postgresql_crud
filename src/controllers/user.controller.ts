import { Request, Response } from "express"


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