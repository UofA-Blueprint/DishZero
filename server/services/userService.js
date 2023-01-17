import db from "../db.js";
import _ from "lodash"
import {getAuth} from "firebase-admin/auth"

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

    getUserFromAuth: async function(uid) {
        try {
            return await getAuth().getUser(uid);
        } catch(err) {
            throw Error("Couldn't get the user");
        }
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