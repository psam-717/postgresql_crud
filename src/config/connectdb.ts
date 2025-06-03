import { PrismaClient } from "../generated/prisma";
//the import above is possible after running 'npx prisma generate'
// a

export const prisma = new PrismaClient();

 const connectDB = async(): Promise<void> => {
    try {
        await prisma.$connect();
        console.log('Connected successfully to the database');

        const result = await prisma.$queryRaw`select current_database()`;
        console.log("Database name", (result as any)[0].current_database);
        
    } catch (error) {
        console.error('Error caused by ',(error as Error).stack );
        process.exit(1)
    }
}

export default connectDB;