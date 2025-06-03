import express, {Request, Response} from "express";
import connectDB from "./config/connectdb";
import cors from 'cors';
import userRoutes from './routes/users.routes'

const app = express();
const port = 5000;


app.use(express.json());

//enable cors for all routes and origins
app.use(cors());

app.use('/api/v1', userRoutes)

// connect to db
connectDB();

app.listen(port, () => {
    console.log(`server is listening on port ${port}`)
})
