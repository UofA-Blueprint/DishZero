import express, { Response, Request } from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import pinoHttp from 'pino-http'
import { getFeatureFlag } from './util/featureFlag'
import { dishRouter } from './routes/dish'
import { transactionsRouter } from './routes/transactions'

const app = express()
dotenv.config()

app.use(cors())
app.use(express.json())
if (process.env.NODE_ENV !== 'test') {
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

app.get('/health', (_: Request, res: Response) => {
    res.status(200).send('OK')
})

if (getFeatureFlag('routes.dish.enabled')) {
    app.use('/api/dish', dishRouter)
}
if (getFeatureFlag('routes.transactions.enabled')) {
    app.use('/api/transactions', transactionsRouter)
}

export { app }
