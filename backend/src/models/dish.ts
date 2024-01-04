export type Dish = {
    id: string
    qid: number
    type: string
    status: DishStatus
    condition?: string
    timesBorrowed: number
    registered: string
    userId: string | null
    borrowedAt: string | null
    // notes: string | null // use to add notes to dish -> future work?
}

export type DishSimple = {
    id: string
    qid: number
    registered: string
    type: string
}

// minimum fields needed to create a dish
export type newDishSimple = {
    id: string
    dishId: number
    dateAdded: string
    type: string
}

export enum DishStatus {
    borrowed = 'borrowed',
    available = 'available',
    overdue = 'overdue',
    broken = 'broken',
    lost = 'lost',
    unavailable = 'unavailable',
}

export enum DishCondition {
    smallChip = 'small_crack_chip',
    largeCrack = 'large_crack_chunk',
    shattered = 'shattered',
    good = 'good',
}
