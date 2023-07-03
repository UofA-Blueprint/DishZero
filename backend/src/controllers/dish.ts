import { Request, Response } from 'express'

import { db } from '../services/firebase'
import { Dish, DishTableVM } from '../utils/models/dish'
import { Transaction } from '../utils/models/transaction'
import { mapDishesToLatestTransaction, mapToDishVM } from '../utils/service/dish'

export const getDishes = async (req: Request, res: Response) => {
    // get dishes from firebase
    let rawDishData = <Array<Dish>>[]
    try {
        let dishesQuerySnapshot = await db.collection('dishes').get()
        dishesQuerySnapshot.docs.forEach( doc => {
            let data = doc.data()
            rawDishData.push({
                id : doc.id,
                qid: parseInt(data.qid, 10),
                registered: data.registered.toDate(),
                type: data.type ? data.type : ''
            })
        })
    } catch (e) {
       internalServerError(req, res, e, 'Error when fetching dishes from firebase')
    }

    req.log.info({message: 'Retrieved dish data from firebase'})

    if (req.query.transaction !== 'yes') {
        req.log.info({message: 'Sending dish data without transactions'})
        res.status(200).json(rawDishData)
    }

    // fine, or replace it later with call to transaction api?
    // get transactions
    let transactions = <Array<Transaction>>[]
    try {
        let transactionsQuerySnapshot = await db.collection('transactions').get()
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
    } catch (e) {
        internalServerError(req, res, e, 'Error when fetching dishes transactions from firebase')
    }

    req.log.info({message: 'Retrieved transactions from firebase'})

    let dishTransMap = new Map<string, {
        transaction: Transaction;
        count: number;
    }>()
    
    let allDishesVM = <Array<any>>[]

    try {
        dishTransMap = mapDishesToLatestTransaction(transactions)
        req.log.info('Mapped dishes to transactions')
    } catch (e) {
        internalServerError(req, res, e, 'Error when mapping dishes to transactions')
    }

    try {    
        allDishesVM = mapToDishVM(rawDishData, dishTransMap)
        req.log.info('Mapped transactions to view model')
    } catch (e) {
        internalServerError(req, res, e, 'Error when mapping dishes to vm')
    }

    // send response
    res.status(200).json(allDishesVM)
}

function internalServerError(req: Request, res: Response, error : any, message: string) {
    req.log.info({message: message})
    req.log.error({error : error})
    res.sendStatus(500)
}
