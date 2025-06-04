import { z } from "zod";
import { Request, Response,NextFunction } from "express";

export interface ValidatedRequest<T extends z.ZodType<any, any>> extends Request{
    validatedBody?: z.infer<T>;
}

export const validateBody = <T extends z.ZodType<any, any>> (schema:T) => {
    return async (req: ValidatedRequest<T>, res: Response, next: NextFunction) => {
        try {
            const validatedData = await schema.parseAsync(req.body);
            req.validatedBody = validatedData;
            next();
        } catch (error) {
            if(error instanceof z.ZodError){
                res.status(400).json({error: 'Validation failed', details: error.errors});
                return;
            }
            res.status(500).json({error: 'Internal server error'})
        }
    }
}

