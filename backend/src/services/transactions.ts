import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'
import { Transaction } from '../models/transaction'
import { db } from '../internal/firebase'
import Logger from '../utils/logger'
import nodeConfig from 'config'
import { getUserById } from './users'
import { User } from '../models/user'

export const getUserTransactions = async (userClaims: DecodedIdToken) => {
    let transactions = <Array<Transaction>>[]
    let transactionsQuerySnapshot = await db
        .collection(nodeConfig.get('collections.transactions'))
        .where('userId', '==', userClaims.uid)
        .get()
    transactionsQuerySnapshot.docs.forEach((doc) => {
        let data = doc.data()
        transactions.push({
            id: doc.id,
            dish: data.dish ? data.dish.id : null,
            userId: data.user,
            returned: data.returned ? data.returned : {},
            timestamp: data.timestamp ? data.timestamp : null,
        })
    })
    return transactions
}

export const getAllTransactions = async () => {
    let transactions = <Array<Transaction>>[]
    let transactionsQuerySnapshot = await db.collection(nodeConfig.get('collections.transactions')).get()
    transactionsQuerySnapshot.docs.forEach((doc) => {
        let data = doc.data()
        transactions.push({
            id: doc.id,
            dish: data.dish ? data.dish.id : null,
            userId: data.user,
            returned: data.returned ? data.returned : {},
            timestamp: data.timestamp ? data.timestamp : null,
        })
    })
    return transactions
}

export const registerTransaction = async (transaction: Transaction) => {
    let docRef = await db.collection(nodeConfig.get('collections.transactions')).add(transaction)
    Logger.info({
        message: 'Transaction registered',
        module: 'transaction.services',
        function: 'registerTransaction',
    })
    return {
        ...transaction,
        id: docRef.id,
    }
}

export const getLatestTransaction = async (userClaims: DecodedIdToken, qid: number) => {
    let transactionQuery = await db
        .collection(nodeConfig.get('collections.transactions'))
        .where('userId', '==', userClaims.uid)
        .where('dish.qid', '==', qid)
        .where('returned.timestamp', '==', '')
        .get()
    if (transactionQuery.empty) {
        return null
    }

    Logger.info({
        message: 'Transaction found',
        module: 'transaction.services',
        function: 'getTransaction',
    })

    return {
        ...transactionQuery.docs[0].data(),
        id: transactionQuery.docs[0].id,
    }
}

/**
 * Fetches the latest transaction by timestamp and qid
 * @param qid number
 * @returns Promise<Transaction>
 */
export const getLatestTransactionByTstamp = async (qid: number) => {
    let transactionQuery = await db
        .collection(nodeConfig.get('collections.transactions'))
        .where('dish.qid', '==', qid)
        .where('returned.timestamp', '==', '')
        .orderBy('timestamp', 'desc')
        .limit(1)
        .get()
    if (transactionQuery.empty) {
        return null
    }
    return {
        ...transactionQuery.docs[0].data(),
        id: transactionQuery.docs[0].id,
    }
}

/**
 * Fetches the latest transaction by timestamp and dishId
 * @param dishId string
 * @returns Promise<Transaction>
 */
export const getLatestTransactionByTstampAndDishId = async (dishId: string) => {
    let transactionQuery = await db
        .collection(nodeConfig.get('collections.transactions'))
        .where('dish.id', '==', dishId)
        .where('returned.timestamp', '==', '')
        .orderBy('timestamp', 'desc')
        .limit(1)
        .get()
    if (transactionQuery.empty) {
        return null
    }
    return {
        ...transactionQuery.docs[0].data(),
        id: transactionQuery.docs[0].id,
    }
}

export const getLatestTransactionBydishId = async (userClaims: DecodedIdToken, dishId: string) => {
    let snapshot = await db
        .collection(nodeConfig.get('collections.transactions'))
        .where('userId', '==', userClaims.uid)
        .where('dish.id', '==', dishId)
        .where('returned.timestamp', '==', '')
        .get()
    if (snapshot.empty) {
        return null
    }

    Logger.info({
        message: 'Transaction found',
        module: 'transaction.services',
        function: 'getTransactionBydishId',
    })

    return {
        ...snapshot.docs[0].data(),
        id: snapshot.docs[0].id,
    }
}

export const getOverdueUserEmails = async () => {
    // get all transactions that are not returned
    let snapshot = await db
        .collection(nodeConfig.get('collections.transactions'))
        .where('returned.timestamp', '==', '')
        .get()

    if (snapshot.empty) {
        return []
    }

    // if older than 24 hours and not returned, add the user address to overdue
    let userEmails = <Array<string>>[]
    snapshot.docs.forEach(async (doc) => {
        let data = doc.data() as Transaction
        const borrowedTime = new Date(data.timestamp)
        const hour = 3600000
        const difference = Math.ceil((Date.now() - borrowedTime.getTime())/hour)
        if (difference > 24) {
            const user = await getUserById(data.userId) as User
            userEmails.push(user.email)
        }
    }) 

    return userEmails
}
