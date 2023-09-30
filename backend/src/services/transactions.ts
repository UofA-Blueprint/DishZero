import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'
import { Transaction } from '../models/transaction'
import { db } from './firebase'
import Logger from '../utils/logger'
import nodeConfig from 'config'

export const getUserTransactions = async (userClaims: DecodedIdToken) => {
    let transactions = <Array<Transaction>>[]
    let transactionsQuerySnapshot = await db
        .collection(nodeConfig.get('collections.transactions'))
        .where('user.id', '==', userClaims.uid)
        .get()
    transactionsQuerySnapshot.docs.forEach((doc) => {
        let data = doc.data()
        transactions.push({
            id: doc.id,
            dish: data.dish ? data.dish.id : null,
            user: data.user,
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
            user: data.user,
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
        .where('user.id', '==', userClaims.uid)
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
        .where('user.id', '==', userClaims.uid)
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
