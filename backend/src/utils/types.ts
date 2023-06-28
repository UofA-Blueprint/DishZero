type User = {
    id : string,
    role : string,
    email : string
}

type Dish = {
    id : string,
    qid : number,
    registered : Date,
    type: string
}

// need more info on returned type
type Transaction = {
    id : string,
    dishID : string,
    userID: string,
    returned : any,
    timestamp : Date
}

enum DishStatus {
    overdue =  "Overdue",
    inUse = "In Use",
    returned = "Returned",
    broken = "Broken",
    lost = "Lost"
}

type DishTableVM = {
    id : string,
    type : string,
    status : DishStatus,
    overdue : number,
    timesBorrowed : number,
    dateAdded : Date
}

export {User, Dish, Transaction, DishStatus, DishTableVM}