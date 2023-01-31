const { db } = require("../db.js");
const _ = require("lodash");
const {remoteConfig} = require("../services/remoteConfig.js");

/**
 * Service for handling transaction objects
 */
const transactionService = {
    // gets the transaction object for the given tranId
    getTransaction: async function(transId) {
        let trans = await db.collection('transactions').doc(transId).get()
        if (!trans.exists) {
            throw Error(`Trans ${transId} does not exist`);
        }
        return trans.data();
    },

    // determines if the dish is returned; takes the transaction id
    isDishReturnedForTransaction: async function(transId) {
        let trans = getTransaction(transId)
        return isDishReturnedForTransactionObject(trans);
    },

    // determines if the dish is returned for the transaction object
    isDishReturnedForTransactionObject: async function(transObj) {
            return !_.isEmpty(transObj?.returned || {});
    },

    getAllTransactions: async function() {
        const transRef = db.collection('transactions');
        let trans = await transRef.get();
        return trans.docs;

    },

    getAllTransactionsData: async function() {
        return (await this.getAllTransactions()).map(t => t.data());
    }, 

    // filters the transactions not yet returned
    filterTransNotReturned: function(trans) {
        return trans.filter((t) => (
            _.isEmpty(t?.returned || {})
        ));
    },

    filterTransOlderThanHours: function(trans, hours) {
        let today = new Date()
        return trans.filter(t => (
            t.timestamp && ((today - t.timestamp.toDate()) / 60 / 1000) > hours
        ))
    },

    getAllUsersPendingNotification: async function() {
        let hourThreshold = await remoteConfig.getCachedUserEmailReturnNotificationHourThreshold();
        let trans = await this.getAllTransactionsData();
        let pendingTrans = this.filterTransNotReturned(trans);
        pendingTrans = this.filterTransOlderThanHours(pendingTrans, hourThreshold);
        let users = new Set();
        pendingTrans.forEach((t) => {
            t.user && users.add(t.user);
        })
        return Array.from(users.values());
    }
};

module.exports = {
    transactionService
}