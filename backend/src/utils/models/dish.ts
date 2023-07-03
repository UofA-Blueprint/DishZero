export type Dish = {
    id : string,
    qid : number,
    registered : Date,
    type: string
}

export enum DishStatus {
    overdue =  "overdue",
    inUse = "in_use",
    returned = "returned",
    broken = "broken",
    lost = "lost"
}

export type DishTableVM = {
    id : string,
    type : string,
    status : DishStatus,
    overdue : number,
    timesBorrowed : number,
    dateAdded : Date
}
