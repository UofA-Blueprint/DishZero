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
import { EmailClient, getEmailCron, initializeEmailCron, isEmailCronEnabled } from './cron/email'
import Logger from './utils/logger'
import { fetchEmailCron } from './controllers/cron/email'

const app = express()
dotenv.config()

app.use(cors({
    origin: '*'
}))
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


// Initialize cron jobs if enabled in firebase
const handleCron = async () => {
    // initializeEmailCron({ cronExpression: "0 0 12 * * MON,THU"}, EmailClient.AWS)
    const cron = await fetchEmailCron()
    if (cron && cron?.enabled) {
        Logger.info('Initializing cron jobs')
        initializeEmailCron({ cronExpression: cron.expression}, EmailClient.AWS)
        console.log(getEmailCron())
    }
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

handleCron()

export { app }
