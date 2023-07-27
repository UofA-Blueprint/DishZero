import { QrCode } from '../models/qrCode';
import { db } from './firebase'
import nodeConfig from 'config';

export const getQrCode = async (qid: string) => {
    let doc = await db.collection(nodeConfig.get('collections.qrcodes')).doc(qid.toString()).get()
    if (!doc.exists) {
        return null
    }
    let data = doc.data()
    return {
        qid: parseInt(doc.id, 10),
        dish: data?.dish
    }
}

export const getAllQrCodes = async () => {
    let codes = <Array<QrCode>>[]
    let qs = await db.collection(nodeConfig.get('collections.qrcodes')).get()
    qs.forEach((doc) => {
        let data = doc.data()
        codes.push({
            qid : parseInt(doc.id, 10),
            dishID : data.dish
        })
    })
    return codes
}
