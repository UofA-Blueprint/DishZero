// need more info on returned type
export type Transaction = {
    id?: string
    dish: {
        qid: number
        id: string
        type: string
    }
    userId: string
    returned: {
        broken: boolean
        lost: boolean
        timestamp?: Date
    }
    timestamp: string
}
