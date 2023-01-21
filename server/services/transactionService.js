const db = require("../db.js");
const _ = require("lodash");


/**
 * Service for handling transaction objects
 */
let transactionService = {
    // gets the transaction object for the given tranId
    getTransaction: async function(transId) {
        let trans = await db.collection('transactions').doc(transId).get()
        if (!trans.exists) {
            throw Error(`Trans ${transId} does not exist`);
        }
        return trans.data();
    },

    // determines if the dish is returned
    isDishReturnedForTransaction: async function(transId) {
        let trans = getTransaction(transId)
        return isDishReturnedForTransactionObject(trans);
    },

    // determines if the dish is returned for the transaction object
    isDishReturnedForTransactionObject: async function(transObj) {
            return !_.isEmpty(transObj?.returned || {});
    },
};

export default transactionService;