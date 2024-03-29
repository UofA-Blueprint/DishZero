import { QrCode } from '../models/qrCode'
import { db } from '../internal/firebase'
import nodeConfig from 'config'
import Logger from '../utils/logger'
import Joi from 'joi'

export const getQrCode = async (qid: string) => {
    let doc = await db.collection(nodeConfig.get('collections.qrcodes')).doc(qid.toString()).get()
    if (!doc.exists) {
        return null
    }
    let data = doc.data()
    return {
        qid: parseInt(doc.id, 10),
        dishId: data?.dishId,
    }
}

export const getAllQrCodes = async () => {
    let codes = <Array<QrCode>>[]
    let qs = await db.collection(nodeConfig.get('collections.qrcodes')).get()
    qs.forEach((doc) => {
        let data = doc.data()
        codes.push({
            qid: parseInt(doc.id, 10),
            dishId: data.dishId,
        })
    })
    Logger.info({
        module: 'qrcode.services',
        message: 'retrieved all qr codes',
    })
    return codes
}

export const createQrCodeInDatabase = async (qrcode: QrCode, update: boolean): Promise<QrCode> => {
    let validation = validateQrRequestBody(qrcode)
    if (validation.error) {
        Logger.error({
            module: 'qrcode.services',
            message: 'Invalid request body',
        })
        throw new Error(validation.error.message)
    }

    // check if qr code already exists if not updating
    if (!update) {
        let existingQrCode = await getQrCode(qrcode.qid.toString())
        if (existingQrCode) {
            Logger.error({
                module: 'qrCode.services',
                message: 'qrCode already exists',
            })
            throw new Error('qrCode already exists')
        }
    }

    let qid = qrcode.qid
    let dishId = qrcode.dishId
    // create qr code
    await db.collection(nodeConfig.get('collections.qrcodes')).doc(qid.toString()).set({ dishId })
    Logger.info({
        module: 'qrcode.services',
        message: 'created qr code in database',
    })

    return {
        qid: qid,
        dishId: dishId,
    }
}

export const deleteQrCodeFromDatabase = async (qid: string) => {
    // if doesn't exist just pretend delete
    let existingQrCode = await getQrCode(qid)
    if (!existingQrCode) {
        Logger.error({
            module: 'qrCode.services',
            message: 'qrCode already exists',
        })
        return
    }

    // delete qr code
    await db.collection(nodeConfig.get('collections.qrcodes')).doc(qid.toString()).delete()
    Logger.info({
        module: 'qrcode.services',
        message: 'qr code in deleted',
    })
    return
}

export const validateQrRequestBody = (qrcode: QrCode) => {
    const schema = Joi.object({
        qid: Joi.number().required(),
        dishId: Joi.string().required(),
    }).required()

    return schema.validate(qrcode)
}
