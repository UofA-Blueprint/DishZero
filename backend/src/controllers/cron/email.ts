import { Request, Response } from 'express'
import { CustomRequest } from '../../middlewares/auth'
import { verifyIfUserAdmin } from '../../services/users'
import Logger from '../../utils/logger'
import { db } from '../../internal/firebase'
import nodeConfig from 'config'
import { validateEmailFields, validateUpdateEmailBody } from '../../services/cron/email'

let moduleName = 'controllers.email'

export const getEmail = async (req: Request, res: Response) => {
    let userClaims = (req as CustomRequest).firebase
    if (!verifyIfUserAdmin(userClaims)) {
        Logger.error({
            message: 'User is not admin',
            moduleName,
            function: 'getEmail',
            statusCode: 403,
        })
        return res.status(403).json({ error: 'forbidden' })
    }

    try {
        let cron = await fetchEmailCron()
        Logger.info({
            message: 'Retrieved cron',
            moduleName,
            function: 'getEmail',
        })
        return res.status(200).json({ cron })
    } catch (error: any) {
        Logger.error({
            error: error,
            moduleName,
            function: 'getEmail',
            message: 'Error when fetching cron from firebase',
            statusCode: 500,
        })
        return res.status(500).json({ error: 'internal_server_error' })
    }
}

export const updateEmail = async (req: Request, res: Response) => {
    let userClaims = (req as CustomRequest).firebase
    if (!verifyIfUserAdmin(userClaims)) {
        Logger.error({
            message: 'User is not admin',
            moduleName,
            function: 'updateEmail',
            statusCode: 403,
        })
        return res.status(403).json({ error: 'forbidden' })
    }

    let query = req.query['fields']?.toString()
    if (query === undefined) {
        Logger.error({
            message: 'Missing fields parameter',
            moduleName,
            function: 'updateEmail',
            statusCode: 400,
        })
        return res.status(400).json({ error: 'missing_type_parameter' })
    }
    // split fields by comma and trim
    let fields = query.split(',').map((field) => field.trim())
    // validate fields
    if(!validateEmailFields(fields)) {
        Logger.error({
            message: 'Invalid fields parameter',
            moduleName,
            function: 'updateEmail',
            statusCode: 400,
        })
        return res.status(400).json({ error: 'invalid_fields_parameter' })
    }
    let body = req.body
    if (!validateUpdateEmailBody(body, fields)) {
        Logger.error({
            message: 'Invalid body',
            moduleName,
            function: 'updateEmail',
            statusCode: 400,
        })
        return res.status(400).json({ error: 'invalid_body' })
    }

    try {
        await db.collection(nodeConfig.get('collections.cron')).doc('email').update(body)
        Logger.info({
            message: 'Updated cron',
            moduleName,
            function: 'updateEmail',
        })
        return res.status(200).json({ message: "email_updated" })
    } catch (error: any) {
        Logger.error({
            error: error,
            moduleName,
            function: 'updateEmail',
            message: 'Error when fetching cron from firebase',
            statusCode: 500,
        })
        return res.status(500).json({ error: 'internal_server_error' })
    }
}

export const enableEmail = async (req: Request, res: Response) => {
    let enabled = req.body.enabled
    console.log(enabled)
    if (enabled === undefined) {
        Logger.error({
            message: 'Missing enabled parameter',
            moduleName,
            function: 'enableEmail',
            statusCode: 400,
        })
        return res.status(400).json({ error: 'missing_enabled_parameter' })
    }
    if (typeof enabled !== 'boolean') {
        Logger.error({
            message: 'Invalid enabled parameter',
            moduleName,
            function: 'enableEmail',
            statusCode: 400,
        })
        return res.status(400).json({ error: 'invalid_enabled_parameter' })
    }

    let userClaims = (req as CustomRequest).firebase
    if (!verifyIfUserAdmin(userClaims)) {
        Logger.error({
            message: 'User is not admin',
            moduleName,
            function: 'enableEmail',
            statusCode: 403,
        })
        return res.status(403).json({ error: 'forbidden' })
    }

    try {
        await enableEmailCron(enabled)
        Logger.info({
            message: 'Updated cron',
            moduleName,
            function: 'enableEmail',
        })
        return res.status(200).json({ enabled })
    } catch (error: any) {
        Logger.error({
            error: error,
            moduleName,
            function: 'enableEmail',
            message: 'Error when fetching cron from firebase',
            statusCode: 500,
        })
        return res.status(500).json({ error: 'internal_server_error' })
    }
}

export const fetchEmailCron = async () => {
    let snapshot = await db.collection(nodeConfig.get('collections.cron')).doc('email').get()
    if (!snapshot.exists) {
        throw new Error('Cron does not exist')
    }

    return snapshot.data()
}

export const enableEmailCron = async (enabled: boolean) => {
    await db.collection(nodeConfig.get('collections.cron')).doc('email').update({
        enabled: enabled,
    })
}
