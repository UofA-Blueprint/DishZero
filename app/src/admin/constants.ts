export interface dishInterface {
    id: string
    type: string
    status: string
    overdue: string
    timesBorrowed: string
    dateAdded: string
}
export const dishes: dishInterface[] = [
    {
        id: '123456789',
        type: 'Dish',
        status: 'In Use',
        overdue: '2',
        timesBorrowed: '30',
        dateAdded: '07/13/2022',
    },
    {
        id: '123456789',
        type: 'Dish',
        status: 'In Use',
        overdue: '0',
        timesBorrowed: '30',
        dateAdded: '07/13/2022',
    },
    {
        id: '123456789',
        type: 'Dish',
        status: 'In Use',
        overdue: '0',
        timesBorrowed: '30',
        dateAdded: '07/13/2022',
    },
    {
        id: '123456789',
        type: 'Mug',
        status: 'In Use',
        overdue: '0',
        timesBorrowed: '30',
        dateAdded: '07/13/2022',
    },
    {
        id: '123456789',
        type: 'Dish',
        status: 'In Use',
        overdue: '0',
        timesBorrowed: '30',
        dateAdded: '07/13/2022',
    },
    {
        id: '545',
        type: 'Mug',
        status: 'In Use',
        overdue: '0',
        timesBorrowed: '30',
        dateAdded: '07/13/2022',
    },
    {
        id: '213',
        type: 'Dish',
        status: 'Overdue',
        overdue: '0',
        timesBorrowed: '30',
        dateAdded: '07/13/2022',
    },
    {
        id: '555',
        type: 'Mug',
        status: 'Returned',
        overdue: '0',
        timesBorrowed: '30',
        dateAdded: '07/13/2022',
    },
]
