export type Dish = {
    id : string,
    qid : number,
    registered : Date,
    type: string
}

export enum DishStatus {
    overdue =  "Overdue",
    inUse = "In Use",
    returned = "Returned",
    broken = "Broken",
    lost = "Lost"
}

export type DishTableVM = {
    id : string,
    type : string,
    status : DishStatus,
    overdue : number,
    timesBorrowed : number,
    dateAdded : Date
}
