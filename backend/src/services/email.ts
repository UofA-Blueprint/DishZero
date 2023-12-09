import nodeConfig from 'config'
import { db } from '../internal/firebase'

export const getTemplate = async () => {
    let snapshot = await db.collection(nodeConfig.get('collections.cron')).doc('email').get()

    const data = snapshot.data()
    return {
        subject : data?.subject,
        body: data?.body,
        senderEmail: data?.senderEmail
    }
}
