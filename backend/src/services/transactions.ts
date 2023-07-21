import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'
import { Transaction } from '../models/transaction'
import { db } from './firebase'

export const getUserTransactions = async (userClaims: DecodedIdToken) => {
    let transactions = <Array<Transaction>>[]
    let transactionsQuerySnapshot = await db.collection('transactions').where('user', '==', userClaims.uid).get()
    transactionsQuerySnapshot.docs.forEach((doc) => {
        let data = doc.data()
        transactions.push({
            id: doc.id,
            dishID: data.dish ? data.dish.id : null,
            userID: data.user,
            returned: data.returned ? data.returned : {},
            timestamp: data.timestamp ? data.timestamp.toDate() : null,
        })
    })
    return transactions
}

export const getAllTransactions = async () => {
    let transactions = <Array<Transaction>>[]
    let transactionsQuerySnapshot = await db.collection('transactions').get()
    transactionsQuerySnapshot.docs.forEach((doc) => {
        let data = doc.data()
        transactions.push({
            id: doc.id,
            dishID: data.dish ? data.dish.id : null,
            userID: data.user,
            returned: data.returned ? data.returned : {},
            timestamp: data.timestamp ? data.timestamp : null,
        })
    })
    return transactions
}
