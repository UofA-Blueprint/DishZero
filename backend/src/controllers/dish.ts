import { Request, Response } from 'express'

import { db } from '../services/firebase'
import { Dish, Transaction } from '../utils/types'
import { mapDishesToLatestTransaction, mapToDishVM } from '../utils/service/dish'

export const getDishes = async (req: Request, res: Response) => {
    // get dishes from firebase
    let dishesQuerySnapshot = await db.collection('dishes').get()
    let rawDishData = <Array<Dish>>[]
    dishesQuerySnapshot.docs.forEach( doc => {
        let data = doc.data()
        rawDishData.push({
            id : doc.id,
            qid: parseInt(data.qid, 10),
            registered: data.registered.toDate(),
            type: data.type ? data.type : ''
        })
    })

    // fine, or replace it later with call to transaction api?
    // get transactions
    let transactionsQuerySnapshot = await db.collection('transactions').get()
    let transactions = <Array<Transaction>>[]
    transactionsQuerySnapshot.docs.forEach(doc => {
        let data = doc.data()
        transactions.push({
            id : doc.id,
            dishID : data.dish ? data.dish.id : null,
            userID : data.user,
            returned : data.returned ? data.returned : {},
            timestamp : data.timestamp? data.timestamp.toDate() : null
        })
    });

    let dishTransMap = mapDishesToLatestTransaction(transactions)
    let allDishesVM = mapToDishVM(rawDishData, dishTransMap)

    // send response
    res.status(200).json(allDishesVM)
}
