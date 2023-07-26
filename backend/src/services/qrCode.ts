import { db } from './firebase'

export const getQrCode = async (qid: string) => {
    let doc = await db.collection('qr-codes').doc(qid.toString()).get()
    if (!doc.exists) {
        return null
    }
    return doc.data()
}
