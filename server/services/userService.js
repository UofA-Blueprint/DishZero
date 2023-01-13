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
    },

    getAdminConfig: async function() {
        let adminConfig = await db.collection('config').doc("admin").get()
        if (!adminConfig.exists) {
            throw Error("The admin config does not exist");
        }
        return adminConfig.data();
    }
};

export default userService;