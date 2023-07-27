import { Request, Response } from 'express'
import { verifyIfUserAdmin } from '../services/users'
import Logger from '../utils/logger'
import { CustomRequest } from '../middlewares/auth'
import { getAllQrCodes, getQrCode } from '../services/qrCode';

export const getQrCodes = async (req: Request, res: Response) => {
    let userClaims = (req as CustomRequest).firebase
    let qid = req.query['qid']?.toString()

    if (!qid) {
        // check if user is admin
        // if yes, return all qr codes

        if (!verifyIfUserAdmin(userClaims)) {
            Logger.error({
                module: 'qrCode.controller',
                message: 'User is not admin',
                statusCode: 403,
            })
            return res.status(403).json({ error: 'forbidden' })
        }

        let codes = await getAllQrCodes()

        Logger.info({
            module: 'qrCode.controller',
            function: 'getQrCodes',
            message : 'retrieved all qr codes',
            status: 200
        })

        return res.status(200).json({ qrCodes : codes })
    }

    // return qr code by qid
    try {
        let qrCode = await getQrCode(qid.toString())
        if (!qrCode) {
            Logger.error({
                message: 'qr code does not exist',
                statusCode: 404,
                module: 'qrCode.controller',
                function: 'getQRCodes',
            })
            return res.status(400).json({ error: 'qr_code_not_found' })
        }
        Logger.info({
            message: 'retrieved qrCode',
            module: 'qrCode.controller',
            function: 'getQRCodes',
        })
        return res.status(200).json({ qrCode: qrCode})
    } catch (error: any) {
        Logger.error({
            message: 'Error when retrieving qr code',
            error,
            statusCode: 500,
            module: 'qrCode.controller',
            function: 'getQRCodes',
        })
        return res.status(500).json({ error: 'internal_server_error', message: error.message })
    }
}