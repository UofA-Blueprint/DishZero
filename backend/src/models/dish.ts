export type Dish = {
    id: string
    qid: number
    registered: string
    type: string
    borrowed: boolean
    condition?: string
}

export enum DishStatus {
    overdue = 'overdue',
    inUse = 'in_use',
    returned = 'returned',
    broken = 'broken',
    lost = 'lost',
}

export type DishTableVM = {
    id: string
    type: string
    status: DishStatus
    overdue: number
    timesBorrowed: number
    dateAdded: string
}
