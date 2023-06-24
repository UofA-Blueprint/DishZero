import express, { Response, Request, NextFunction } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import nodeConfig from 'config';

const app = express();
dotenv.config();

app.use(cors());

app.get('/health', (req: Request, res: Response) => {
    res.status(200).send('OK');
});

export { app };
