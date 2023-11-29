export interface User {
    email: string
    inUse: number
    overdue: number // TODO: should this be a date?
    role: string
}

export const mockUsers: Array<User> = [
    {
        email: 'AAAAA@ualberta.ca',
        inUse: 2,
        overdue: 30, // TODO: should this be a date?
        role: 'Basic'
    },
    {
        email: 'hello1@ualberta.ca',
        inUse: 3,
        overdue: 30, // TODO: should this be a date?
        role: 'Volunteer'
    },
    {
        email: 'hello2admin@ualberta.ca',
        inUse: 2,
        overdue: 12, // TODO: should this be a date?
        role: 'Admin'
    },
    {
        email: 'BBBB@ualberta.ca',
        inUse: 17,
        overdue: 30, // TODO: should this be a date?
        role: 'Basic'
    },
    {
        email: 'hello4@ualberta.ca',
        inUse: 2,
        overdue: 42, // TODO: should this be a date?
        role: 'Basic'
    },
    {
        email: 'CCCC@ualberta.ca',
        inUse: 2,
        overdue: 30, // TODO: should this be a date?
        role: 'Basic'
    },
    {
        email: 'hello6@ualberta.ca',
        inUse: 123,
        overdue: 30, // TODO: should this be a date?
        role: 'Basic'
    },
]