import express, { Response, Request } from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import pinoHttp from 'pino-http'
import { dishRouter } from './routes/dish'
import { transactionsRouter } from './routes/transactions'
import { userRouter } from './routes/users'
import { authRouter } from './routes/auth'
import cookieParser from 'cookie-parser'
import { qrCodeRouter } from './routes/qrCode'
import nodeConfig from 'config'
import { cronRouter } from './routes/cron'
import { EmailClient, initializeEmailCron } from './cron/email'
import Logger from './utils/logger'

const app = express()
dotenv.config()

app.use(cors())
app.use(express.json())
app.use(cookieParser())

let environment = process.env.NODE_ENV

if (environment === 'prod') {
    app.use(
        pinoHttp({
            transport: {
                target: 'pino-pretty',
                options: {
                    levelFirst: true,
                    colorize: true,
                    translateTime: true,
                },
            },
        })
    )
}

// Initialize all the cron jobs
if (nodeConfig.get('cron.enabled')) {
    Logger.info('Initializing cron jobs')
    initializeEmailCron({ cronExpression: nodeConfig.get('cron.default.email') }, EmailClient.AWS)
}

app.get('/health', (_: Request, res: Response) => {
    res.status(200).send('OK')
})

app.use('/api/auth', authRouter)
app.use('/api/dish', dishRouter)
app.use('/api/transactions', transactionsRouter)
app.use('/api/users', userRouter)
app.use('/api/qrcode', qrCodeRouter)
app.use('/api/cron', cronRouter)

export { app }
