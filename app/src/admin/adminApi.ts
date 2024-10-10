import { GridRowId } from '@mui/x-data-grid'
import axios from 'axios'
import { DishStatus } from './Dishes/constants'

type StatusItem = {
    email: string
    count: number
}

type DishStatusByUser = {
    userId: string
    emailAddress: string
    inUse: number
    overdue: number
    role: string
}

export const headers = (token: string) => {
    return {
        'x-api-key': process.env.REACT_APP_API_KEY || 'test',
        'session-token': token,
    }
}

const adminApi = {
    serverAddress: process.env.REACT_APP_BACKEND_ADDRESS,

    getTransactions: async function (token: string) {
        const response = await axios
            .get(`${this.serverAddress}/api/transactions?all=true`, {
                headers: headers(token),
            })
            .then((res) => {
                return res
            })
            .catch((err) => {
                console.error(`Failed to get transactions from the database. ${err}.`)
            })
        const transactions = response?.data.transactions
        return transactions
    },
    getDishByQid: async function (token: string, qid: string) {
        const response = await axios
            .get(`${this.serverAddress}/api/dish?qid=${qid}}`, {
                headers: headers(token),
            })
            .then((res) => {
                return res
            })
            .catch((err) => {
                console.error(`Failed to get dish using qid from database. ${err}.`)
            })
        const dish = response?.data.dish
        return dish
    },
    getAllDishes: async function (token: string, withEmail?: boolean) {
        const response = await axios
            .get(`${this.serverAddress}/api/dish?all=true&transaction=true&withEmail=${withEmail?.toString()}`, {
                headers: headers(token),
            })
            .then((res) => {
                return res
            })
            .catch((err) => {
                console.error(`Failed to get dishes from database. ${err}.`)
            })
        const dishes = response?.data.dishes
        return dishes
    },
    getDishTypes: async function (token: string) {
        const response = await axios
            .get(`${this.serverAddress}/api/dish/getDishTypes`, {
                headers: headers(token),
            })
            .then((res) => {
                return res
            })
            .catch((err) => {
                console.log(`Failed to get dish types from the database. ${err}.`)
            })
        const dishTypes = response?.data.dishTypes
        return dishTypes
    },

    addDishType: async function (token: string, dishType: string) {
        const response = await axios
            .post(
                `${this.serverAddress}/api/dish/addDishType`,
                {
                    type: dishType,
                },
                {
                    headers: headers(token),
                },
            )
            .then((res) => {
                console.log('res', res)
                return res
            })
            .catch((err) => {
                // eslint-disable-next-line no-console
                console.error(`Failed to add dish type to the database. ${err}.`)
                return err
            })
        return response
    },

    addDish: async function (
        token: string,
        qid: number,
        type: string,
        status?: string,
        timesBorrowed?: number,
        registered?: string,
    ) {
        const response = await axios
            .post(
                `${this.serverAddress}/api/dish/create`,
                {
                    dish: {
                        qid,
                        type,
                        status,
                        timesBorrowed,
                        registered,
                    },
                },
                {
                    headers: headers(token),
                },
            )
            .then((res) => {
                return res
            })
            .catch((err) => {
                // eslint-disable-next-line no-console
                console.error(`Failed to add dish to the database. ${err}.`)
                return err
            })
        return response
    },

    addDishes: async function (token: string, dishType: string, dishIdLower: number, dishIdUpper: number) {
        const response = await axios
            .post(
                `${this.serverAddress}/api/dish/createMultipleDishes`,
                {
                    dishIdLower: dishIdLower,
                    dishIdUpper: dishIdUpper,
                    type: dishType,
                },
                {
                    headers: headers(token),
                },
            )
            .then((res) => {
                return res
            })
            .catch((err) => {
                // eslint-disable-next-line no-console
                console.error(`Failed to add dish(es) to the database. ${err}.`)
                return err
            })
        return response
    },
    returnDish: async function (token: string, qid: string) {
        const response = await axios
            .post(
                `/api/dish/return`,
                {
                    returned: {
                        condition: 'good',
                    },
                    // qid: qid,
                },
                {
                    headers: headers(token),
                    params: { qid: qid },
                },
            )
            .then((res) => {
                return res
            })
            .catch((err) => {
                // eslint-disable-next-line no-console
                console.error(`Failed to return dish. ${err}.`)
                return err
            })
        return response
    },

    // deleteDishes: async function (token: string, dishIds: Array<string>) {
    deleteDishes: async function (token: string, dishIds: GridRowId[]) {
        const dishIdStrings = dishIds.map((dishId) => dishId.toString())
        const response = await axios
            .post(
                `${this.serverAddress}/api/dish/delete`,
                {
                    dishIds: dishIdStrings,
                },
                {
                    headers: headers(token),
                },
            )
            .then((res) => {
                return res
            })
            .catch((err) => {
                // eslint-disable-next-line no-console
                console.error(`Failed to delete dishes from the database. ${err}.`)
            })
        return response
    },

    getUsers: async function (token: string) {
        const response = await axios
            .get(`${this.serverAddress}/api/users`, {
                headers: headers(token),
            })
            .then((res) => {
                return res
            })
            .catch((err) => {
                console.log(`Failed to get users from the database. ${err}.`)
            })
        const users = response?.data.users
        return users
    },

    getInUseDishesForEachUser: async function (token: string) {
        try {
            const result: Array<StatusItem> = []
            const dishes = await this.getAllDishes(token)
            if (dishes.length > 0) {
                const users = await this.getUsers(token)
                if (users.length > 0) {
                    for (const user of users) {
                        let count = 0
                        for (const dish of dishes) {
                            if (dish.userId === user.id && dish.status === DishStatus.borrowed) {
                                count += 1
                            }
                        }
                        result.push({
                            email: user.email,
                            count: count,
                        })
                    }
                }
            }
            return result
        } catch (err) {
            console.log(`ERROR: could not get in-use dishes for each user from the database. ${err}.`)
            return []
        }
    },

    getOverdueDishesForEachUser: async function (token: string) {
        try {
            const result: Array<StatusItem> = []
            const dishes = await this.getAllDishes(token)
            if (dishes.length > 0) {
                const users = await this.getUsers(token)
                if (users.length > 0) {
                    for (const user of users) {
                        let count = 0
                        for (const dish of dishes) {
                            if (dish.userId === user.id && dish.status === DishStatus.borrowed) {
                                const firebaseTimestamp = new Date(dish.borrowedAt)
                                const currentTimestamp = new Date().getTime()
                                let timeDifference
                                let hoursDifference
                                if (firebaseTimestamp != null) {
                                    timeDifference = currentTimestamp - firebaseTimestamp.getTime()
                                    hoursDifference = timeDifference / 3600000
                                    if (hoursDifference > 48) count += 1
                                }
                            }
                        }
                        result.push({
                            email: user.email,
                            count: count,
                        })
                    }
                }
            }
            return result
        } catch (err) {
            console.log(`ERROR: could not get overdue dishes for each user from the database. ${err}.`)
            return []
        }
    },

    getDishesStatusForEachUser: async function (token: string) {
        try {
            const inUseDishesByUser = await this.getInUseDishesForEachUser(token)
            const overdueDishesByUser = await this.getOverdueDishesForEachUser(token)
            const users = await this.getUsers(token)
            const result: Array<DishStatusByUser> = []
            if (inUseDishesByUser.length > 0 && overdueDishesByUser.length > 0) {
                for (let i = 0; i < users.length; i++) {
                    result.push({
                        userId: users[i].id,
                        emailAddress: users[i].email,
                        inUse: inUseDishesByUser[i].count,
                        overdue: overdueDishesByUser[i].count,
                        role: users[i].role,
                    })
                }
            }
            return result
        } catch (err) {
            console.log(`ERROR: could not get dishes status for each user from the database. ${err}.`)
            return []
        }
    },

    modifyRole: async function (token: string, userId: string, newRole: string, email: string) {
        await axios
            .post(
                `${this.serverAddress}/api/users/modify/role`,
                {
                    user: {
                        id: userId,
                        role: newRole,
                        email: email,
                    },
                },
                {
                    headers: headers(token),
                },
            )
            .then((res) => {
                console.log("Successfully modified user's role.", res)
            })
            .catch((err) => {
                console.log(`ERROR: Failed to modify user's role. ${err}.`)
            })
    },

    modifyDishStatus: async function (token: string, id: string, oldStatus: string, newStatus: string) {
        const response = await axios
            .post(
                `${this.serverAddress}/api/dish/modifyDishStatus`,
                {
                    id,
                    oldStatus,
                    newStatus,
                },
                {
                    headers: headers(token),
                },
            )
            .then((res) => {
                // eslint-disable-next-line no-console
                console.log('Successfully changed the dish status', res)
                return res
            })
            .catch((err) => {
                // eslint-disable-next-line no-console
                console.error(`ERROR: Failed to change the dish status. ${err}.`)
                return err
            })

        return response
    },
}

export default adminApi
