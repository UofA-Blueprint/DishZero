import nodeConfig from 'config'
import { db } from '../internal/firebase'

export const getTemplate = async () => {
    let snapshot = await db.collection(nodeConfig.get('collections.email')).doc('template').get()

    const data = snapshot.data()
    return {
        subject : data?.subject,
        content: data?.content
    }
}
