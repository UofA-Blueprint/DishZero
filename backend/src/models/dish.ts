export type Dish = {
    id: string
    qid: number
    registered: string
    type: string
    borrowed: boolean
    condition?: string
    timesBorrowed: number
    status: DishStatus
    userId: string | null
    borrowedAt: string | null
}

export type DishSimple = {
    id: string
    qid: number
    registered: string
    type: string
}

export enum DishStatus {
    overdue = 'overdue',
    inUse = 'in_use',
    returned = 'returned',
    broken = 'broken',
    lost = 'lost',
    available = 'available',
}

export enum Condition {
    smallChip = 'small_crack_chip',
    largeCrack = 'large_crack_chunk',
    shattered = 'shattered',
    alright = 'alright',
}

export type DishTableVM = {
    id: string
    type: string
    status: DishStatus
    overdue: number
    timesBorrowed: number
    dateAdded: string
}
