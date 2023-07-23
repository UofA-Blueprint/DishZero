import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'
import { Transaction } from '../models/transaction'
import { db } from './firebase'
import Logger from '../utils/logger'
import Joi from 'joi'

export const getUserTransactions = async (userClaims: DecodedIdToken, startAfter: string, limit: number) => {
    let transactions = <Array<Transaction>>[]

    let transactionsQuerySnapshot
    if (startAfter === '') {
        // first page
        transactionsQuerySnapshot = await db
            .collection('transactions')
            .where('userID', '==', userClaims.uid)
            .orderBy('timestamp', 'desc')
            .limit(limit)
            .get()
    } else {
        transactionsQuerySnapshot = await db
            .collection('transactions')
            .where('userID', '==', userClaims.uid)
            .orderBy('timestamp', 'desc')
            .startAfter(startAfter)
            .limit(limit)
            .get()
    }
    transactionsQuerySnapshot.docs.forEach((doc) => {
        let data = doc.data()
        transactions.push({
            id: doc.id,
            dish: data.dish ? data.dish.id : null,
            userID: data.user,
            returned: data.returned ? data.returned : {},
            timestamp: data.timestamp ? data.timestamp : null,
        })
    })
    return transactions
}

export const getAllTransactions = async (startAfter: string, limit: number) => {
    let transactions = <Array<Transaction>>[]
    let transactionsQuerySnapshot
    if (startAfter === '') {
        // first page
        transactionsQuerySnapshot = await db
            .collection('transactions')
            .orderBy('timestamp', 'desc')
            .limit(limit)
            .get()
    } else {
        transactionsQuerySnapshot = await db
            .collection('transactions')
            .orderBy('timestamp', 'desc')
            .startAfter(startAfter)
            .limit(limit)
            .get()
    }
    transactionsQuerySnapshot.docs.forEach((doc) => {
        let data = doc.data()
        transactions.push({
            id: doc.id,
            dish: data.dish ? data.dish.id : null,
            userID: data.user,
            returned: data.returned ? data.returned : {},
            timestamp: data.timestamp ? data.timestamp : null,
        })
    })
    return transactions
}

export const registerTransaction = async (transaction: Transaction) => {
    let docRef = await db.collection('transactions').add(transaction)
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

export const getTransaction = async (userClaims: DecodedIdToken, qid: number) => {
    let transactionQuery = await db
        .collection('transactions')
        .where('userID', '==', userClaims.uid)
        .where('dish.qid', '==', qid)
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

export const validatePaginationRequestBody = (pagination: any) => {
    const schema = Joi.object({
        startAfter: Joi.string().required(),
        prevPage: Joi.number().required(),
        nextPage: Joi.number().required(),
    }).required()

    return schema.validate(pagination)
}
