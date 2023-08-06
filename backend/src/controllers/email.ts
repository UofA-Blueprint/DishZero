import { Request, Response } from 'express'

export const getEmail = async (req: Request, res: Response) => {
    res.status(200).send('OK')
}
