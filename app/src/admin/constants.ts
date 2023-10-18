export interface Dish {
    dishId: number
    // dishType: DishType
    dishType: DishType
    status: DishStatus
    overdue: number
    timesBorrowed: number
    dateAdded: Date // or date?
}

export enum DishType {
    MUG = 'Mug',
    DISH = 'Dish',
}
// export const DishTypeArray = ['Mug', 'Dish']

export const DishTypeColors = {
    Mug: '#496EA5',
    Dish: '#496EA5',
}

export enum DishStatus {
    BORROWED = 'Borrowed',
    RETURNED = 'Returned',
    LOST = 'Lost',
    OVERDUE = 'Overdue',
    BROKEN = 'Broken',
}

export const DishStatusColors = {
    Borrowed: '#68B49A',
    Returned: '#29604D',
    Lost: '#BF4949',
    Overdue: '#BF4949',
    Broken: '#BF4949',
}
// export const DishStatusArray = ['Borrowed', 'Returned', 'Lost', 'Overdue', 'Broken']

export const dishes: Dish[] = [
    {
        dishId: 123456785,
        dishType: DishType.DISH,
        status: DishStatus.BORROWED,
        // dishType: 'Dish',
        // status: 'Borrowed',
        overdue: 2,
        timesBorrowed: 10,
        dateAdded: new Date('07/13/2022'),
    },
    {
        dishId: 123456786,
        dishType: DishType.DISH,
        status: DishStatus.RETURNED,
        // dishType: 'Dish',
        // status: 'Borrowed',
        overdue: 2,
        timesBorrowed: 20,
        dateAdded: new Date('07/13/2022'),
    },
    {
        dishId: 123456787,
        dishType: DishType.DISH,
        status: DishStatus.LOST,
        // dishType: 'Dish',
        // status: 'Borrowed',
        overdue: 0,
        timesBorrowed: 100,
        dateAdded: new Date('07/13/2022'),
    },
    {
        dishId: 123456788,
        dishType: DishType.MUG,
        status: DishStatus.OVERDUE,
        // dishType: 'Mug',
        // status: 'Borrowed',
        overdue: 0,
        timesBorrowed: 53,
        dateAdded: new Date('07/13/2022'),
    },
    {
        dishId: 123456789,
        dishType: DishType.DISH,
        status: DishStatus.BROKEN,
        // dishType: 'Dish',
        // status: 'Borrowed',
        overdue: 0,
        timesBorrowed: 30,
        dateAdded: new Date('07/13/2022'),
    },
    {
        dishId: 545,
        dishType: DishType.MUG,
        status: DishStatus.BORROWED,
        // dishType: 'Mug',
        // status: 'Borrowed',
        overdue: 0,
        timesBorrowed: 30,
        dateAdded: new Date('07/12/2022'),
    },
    {
        dishId: 213,
        dishType: DishType.DISH,
        status: DishStatus.OVERDUE,
        // dishType: 'Dish',
        // status: 'Overdue',
        overdue: 0,
        timesBorrowed: 30,
        dateAdded: new Date('07/14/2022'),
        // dateAdded: '07/14/2022',
    },
    {
        dishId: 555,
        dishType: DishType.MUG,
        status: DishStatus.RETURNED,
        // dishType: 'Mug',
        // status: 'Returned',
        overdue: 0,
        timesBorrowed: 30,
        dateAdded: new Date('07/13/2023'),
    },
]
