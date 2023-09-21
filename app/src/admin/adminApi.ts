enum DishStatus {
    overdue = 'overdue',
    inUse = 'in_use',
    returned = 'returned',
    broken = 'broken',
    lost = 'lost',
    available = 'available'
}

type StatusItem = {
    email: string,
    count: number
};

type DishStatusByUser = {
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

    getAllDishes: async function(token: string) {
        try {
            let allDishesReq = await fetch(
                `${this.serverAddress}/api/dish`, 
                {
                    headers: headers(token)
                }
            );
            if (allDishesReq.ok) {
                return await allDishesReq.json();
            }
        } catch (err) {
            // encountered error
            console.log(`Couldn't get the dish data`);
            return [];
        }
    },

    getUsers: async function (token: string) {
        try {
            const getUsersResponse = await fetch(
                `${this.serverAddress}/api/users`, 
                {
                    headers: headers(token)
                }
            );
            if (getUsersResponse.ok) {
                return await getUsersResponse.json();
            }
        }
        catch (err) {
            console.log(`ERROR: could not retrieve users from backend. ${err}.`);
            return [];
        }
    },

    getInUseDishesForEachUser: async function (token: string) {
        try {
            let result: Array<StatusItem> = [];
            const dishes = await this.getAllDishes(token);
            if (dishes.length > 0) {
                const users = await this.getUsers(token);
                if (users.length > 0) {
                    for (let user of users) {
                        let count = 0;
                        for (let dish of dishes) {
                            if (dish.userId === user.id && dish.status === DishStatus.inUse) {
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

    getOverdueDishesForEachUser: async function (token: string) {
        try {
            let result: Array<StatusItem> = [];
            const dishes = await this.getAllDishes(token);
            if (dishes.length > 0) {
                const users = await this.getUsers(token);
                if (users.length > 0) {
                    for (let user of users) {
                        let count = 0;
                        for (let dish of dishes) {
                            if (dish.userId === user.id && dish.status === DishStatus.overdue) {
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

    getDishesStatusForEachUser: async function (token: string) {
        try {
            const inUseDishesByUser = await this.getInUseDishesForEachUser(token);
            const overdueDishesByUser = await this.getOverdueDishesForEachUser(token);
            const users = await this.getUsers(token);
            let result: Array<DishStatusByUser> = [];
            if (inUseDishesByUser && overdueDishesByUser) {
                for (let i = 0; i < users.length; i++) {
                    result.push({
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
    }
};

export default adminApi;