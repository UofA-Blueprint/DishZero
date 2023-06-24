import express, { Response, Request, NextFunction } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import pinoHttp from 'pino-http';

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== 'test') {
    app.use(pinoHttp(
        {
            transport: {
                target: 'pino-pretty',
                options: {
                    levelFirst: true,
                    colorize: true,
                    translateTime: true
                }
            }
        }
    ));
}

app.get('/health', (req: Request, res: Response) => {
    res.status(200).send('OK');
});

export { app };
