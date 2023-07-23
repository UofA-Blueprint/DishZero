import { Request, Response } from 'express'
import { CustomRequest } from '../middlewares/auth'
import { verifyIfUserAdmin } from '../services/users'
import { getAllTransactions, getUserTransactions, validatePaginationRequestBody } from '../services/transactions'
import Logger from '../utils/logger'

export const getTransactions = async (req: Request, res: Response) => {
    let userClaims = (req as CustomRequest).firebase
    let all = req.query['all']?.toString()
    let page = req.query['page']?.toString()
    let size = req.query['size']?.toString()

    let pageNumber
    let pageSize
    if (!page) {
        pageNumber = 1
    } else {
        pageNumber = parseInt(page, 10)
        if (Number.isNaN(pageNumber)) {
            pageNumber = 1
        }
    }

    if (!size) {
        pageSize = 10
    } else {
        pageSize = parseInt(size, 10)
        if (Number.isNaN(pageSize)) {
            pageSize = 10
        }
    }

    // if page number is not 1, we must have pagination information
    let startAfter
    let prevPage
    let nextPage
    if (pageNumber !== 1) {
        let validation = validatePaginationRequestBody(req.body.pagination)
        if (validation.error) {
            Logger.error({
                module: 'dish.controller',
                message: 'Pagination information not provided',
                statusCode: 400,
            })

            return res.status(400).json({ error: 'bad_request', message: 'pagination information not provided' })
        }

        startAfter = req.body.startAfter
        prevPage = pageNumber - 1
        nextPage = pageNumber + 1
    } else {
        startAfter = ''
        nextPage = 2
    }

    let transactions
    if (all === 'true') {
        // check if user is admin
        if (verifyIfUserAdmin(userClaims)) {
            // return all transactions
            try {
                transactions = await getAllTransactions(startAfter, pageSize)
                Logger.info({
                    message: 'retrieved all transactions',
                })

                startAfter = transactions[transactions.length - 1].timestamp

                return res.status(200).json({
                    transactions,
                    pagination: {
                        startAfter,
                        prevPage,
                        nextPage,
                    },
                })
            } catch (err: any) {
                Logger.error({
                    error: err.message,
                    statusCode: 500,
                })
                res.status(500).json({ error: 'internal_server_error', message: err.message })
            }
        } else {
            Logger.error({
                message: 'User is not admin',
                statusCode: 403,
            })
            return res.status(403).json({ error: 'forbidden' })
        }
    }

    // if query is not present, get transactions based on user_id
    try {
        transactions = await getUserTransactions(userClaims, startAfter, pageSize)

        startAfter = transactions[transactions.length - 1].timestamp

        return res.status(200).json({
            transactions,
            pagination: {
                startAfter,
                prevPage,
                nextPage,
            },
        })
    } catch (e) {
        Logger.error({
            error: e,
            message: 'Error when fetching transactions from firebase',
            statusCode: 500,
        })
        res.status(500).json({ error: 'internal_server_error' })
        return
    }
}
