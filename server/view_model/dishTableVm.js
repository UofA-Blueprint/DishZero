class DishTableVm {
    constructor(id, type, status, overdue, timesBorrowed, dateAdded) {
        this.id = id;
        this.type = type;
        this.status = status;
        this.overdue = overdue;
        this.timesBorrowed = timesBorrowed;
        this.dataAdded = dateAdded;
    }
}

/**
 * Enum for Dish Status
 */
const DishStatus = {
    overdue: "overdue",
    inUse: "In Use",
    returned: "Returned",
    broken: "Broken",
    lost: "Lost",
}

module.exports = {
    DishTableVm,
    DishStatus
}