import {z} from 'zod';

export const createUserSchema = z.object({
    firstName: z.string().nonempty( {message:'first name should be provided'}).trim(),
    lastName: z.string().nonempty({message: 'last name should be provided'}).trim(),
    email: z.string().email({message: 'Invalid email address'}).trim().toLowerCase(),
    password: z.string().nonempty({message: 'Password field must be provided'}).trim(),
    phone: z.string().nonempty({message: 'Phone number should be provided'}).trim(), 
    location: z.string().nonempty({message: 'location should be provided'}).trim(), 

});

export const loginSchema = z.object({
    email: z.string().email({message: 'Invalid email address'}).trim().toLowerCase(),
    password: z.string().nonempty({message: 'Password field must be provided'}).trim(),
})

//generating a typescript type for createUserSchema
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginUserInput = z.infer<typeof loginSchema>;