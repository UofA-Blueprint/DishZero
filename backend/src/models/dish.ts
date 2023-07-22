export type Dish = {
    id: string
    qid: number
    registered: string
    type: string
    borrowed: boolean
    condition?: string
    timesBorrowed: number
    status: DishStatus
}

export type DishSimple = {
    id: string,
    qid: number,
    registered: string,
    type: string
}

export enum DishStatus {
    overdue = 'overdue',
    inUse = 'in_use',
    returned = 'returned',
    broken = 'broken',
    lost = 'lost',
    available = 'available'
}

export type DishTableVM = {
    id: string
    type: string
    status: DishStatus
    overdue: number
    timesBorrowed: number
    dateAdded: string
}
