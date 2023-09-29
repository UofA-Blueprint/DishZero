import axios from 'axios';

type StatusItem = {
    email: string,
    count: number
};

type DishStatusByUser = {
    userId: string;
    emailAddress: string;
    inUse: number;
    overdue: number;
    role: string;
}

const headers = (token: string) => {
    return {
        "x-api-key": process.env.REACT_APP_API_KEY || "test",
        "session-token": token
    };
};

const adminApi = {
    serverAddress: process.env.REACT_APP_BACKEND_ADDRESS,

    getTransactions: async function(token: string) {
        const response: any = await axios.get(
            `${this.serverAddress}/api/transactions?all=true`,
            {
                headers: headers(token)
            }
        ).then(
            res => { return res; }
        ).catch(
            err => { console.log(`Failed to get transactions from database. ${err}.`); }
        );
        const transactions = response.data.transactions;
        return transactions;
    },

    getAllDishes: async function(token: string) {
        const response: any = await axios.get(
            `${this.serverAddress}/api/dish?all=true`, 
            {
                headers: headers(token)
            }
        ).then(
            res => { return res; }
        ).catch(
            err => { console.log(`Failed to get dishes from database. ${err}.`); }
        );
        const dishes = response.data.dishes;
        return dishes;
    },

    getUsers: async function(token: string) {
        const response: any = await axios.get(
            `${this.serverAddress}/api/users`, 
            {
                headers: headers(token)
            }
        ).then(
            res => { return res; }
        ).catch(
            err => { console.log(`Failed to get users from database. ${err}.`) }
        );
        const users = response.data.users;
        return users;
    },

    getInUseDishesForEachUser: async function(token: string) {
        try {
            const result: Array<StatusItem> = [];
            const dishes = await this.getAllDishes(token);
            if (dishes.length > 0) {
                const users = await this.getUsers(token);
                if (users.length > 0) {
                    for (const user of users) {
                        let count = 0;
                        for (const dish of dishes) {
                            if (dish.userId === user.id && dish.borrowed === true) {
                                count += 1;
                            }
                        }
                        result.push({
                            email: user.email,
                            count: count
                        });
                    }
                }
            }
            return result;
        } catch(err) {
            console.log(`ERROR: could not get in-use dishes for each user from backend. ${err}.`);
            return [];
        }
    },

    getOverdueDishesForEachUser: async function(token: string) {
        try {
            const result: Array<StatusItem> = [];
            const dishes = await this.getAllDishes(token);
            if (dishes.length > 0) {
                const users = await this.getUsers(token);
                if (users.length > 0) {
                    for (const user of users) {
                        let count = 0;
                        for (const dish of dishes) {
                            const firebaseTimestamp = dish.borrowedAt;
                            const currentTimestamp = new Date().getTime();
                            const timeDifference = currentTimestamp - firebaseTimestamp;
                            const hoursDifference = timeDifference / (1000 * 60 * 60);
                            if (dish.userId === user.id && hoursDifference > 48) {
                                count += 1;
                            }
                        }
                        result.push({
                            email: user.email,
                            count: count
                        });
                    }
                }
            }
            return result;
        } catch (err) {
            console.log(`ERROR: could not get overdue dishes for each user from backend. ${err}.`);
            return [];
        }
    },

    getDishesStatusForEachUser: async function(token: string) {
        try {
            const inUseDishesByUser = await this.getInUseDishesForEachUser(token);
            const overdueDishesByUser = await this.getOverdueDishesForEachUser(token);
            const users = await this.getUsers(token);
            const result: Array<DishStatusByUser> = [];
            if (inUseDishesByUser.length > 0 && overdueDishesByUser.length > 0) {
                for (let i = 0; i < users.length; i++) {
                    result.push({
                        userId: users[i].id,
                        emailAddress: users[i].email,
                        inUse: inUseDishesByUser[i].count,
                        overdue: overdueDishesByUser[i].count,
                        role: users[i].role
                    });
                }
            }
            return result;
        } catch (err) {
            console.log(`ERROR: could not get dishes status for each user from backend. ${err}.`);
            return [];
        }
    },

    modifyRole: async function(token: string, userId: string, newRole: string, email: string) {
        await axios.post(
            `${this.serverAddress}/api/users/modify/role`, 
            {
                user: {
                    id: userId,
                    role: newRole,
                    email: email
                }
            },
            {
                headers: headers(token)
            }
        ).then(
            res => {
                console.log("Successfully modified user's role.");
            }
        ).catch(
            err => {
                console.log(`ERROR: Failed to modify user's role. ${err}.`);
            }
        );
    }
};

export default adminApi;