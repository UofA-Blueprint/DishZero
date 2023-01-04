import db from "../db.js";
import _ from "lodash"

import User from "../model/user.js"

let userService = {
    getUser: async function(userId) {
        let user = await db.collection('users').doc(userId).get()
        if (!user.exists) {
            throw Error(`Trans ${userId} does not exist`);
        }
        user = user.data();
        return new User(userId, user.role);
    }
};

export default userService;