import db from "../db.js";
import _ from "lodash"

let transactionService = {
    isDishReturnedForTransaction: async function(transId, userId, dishId) {
        let trans = await db.collection('transactions').doc(transId).get()
        if (!trans.exists) {
            throw Error(`Trans ${transId} does not exist`);
        }
        return !_.isEmpty(trans.data()?.returned || {});
    }
};

export default transactionService;