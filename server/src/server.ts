import dotenv from 'dotenv';
import 'reflect-metadata';
import bodyParser from 'body-parser';
import express, { Application } from 'express';
import connectDB from './db/connectDB';
import route from './routes';
import cors from 'cors';

dotenv.config();
connectDB();
const app: Application= express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors());

route(app);

const PORT = parseInt(process.env.SERVER_PORT as string) || 6969;

app.listen(PORT, () => console.log(`server is runing in port ${PORT}`));
