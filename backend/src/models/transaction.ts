import { User } from "./user"

// need more info on returned type
export type Transaction = {
    id?: string
    dish: {
        qid: number
        id: string
        type: string
    }
    returned: {
        condition: string
        timestamp?: string
    }
    timestamp: string,
    user: User | undefined
}
