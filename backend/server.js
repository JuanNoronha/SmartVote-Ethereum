import express from 'express';
import 'dotenv/config'
import mongoose from 'mongoose';
import adminRouter from './routes/adminRoutes.js';
import voterRouter from './routes/voterRoutes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { logout, verify } from './controllers/auth.js';

const app = express();
const corsOptions = {
    origin: 'http://localhost:5173', 
    credentials: true,
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/admin',adminRouter);
app.use('/voter',voterRouter);

app.get('/verify',verify);
app.get('/logout',logout);

const db_connection = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log('mongodb connected');
    } catch(err) {
        console.log(err);
    }
}

app.get('/',(req,res) => {
    res.send('Hello world!');
})

app.listen(3000, () => {
    console.log('e-voting server running');
    db_connection();
})