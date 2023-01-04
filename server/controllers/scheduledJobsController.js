import schedule from "node-schedule";

import firestore from "../db.js";

const scheduledJobsController = {
    // Schedules a job to send the reminder to return the borrowed dish
    dishCheckoutReturnReminder: function (transId, userId, dishId) {
        const delay = 2; // TODO: Get this through the db
        const notifDate = new Date();
        notifDate.setSeconds(notifDate.getSeconds() + delay);
        const job = schedule.scheduleJob(notifDate, function(transId, userId, dishId) {
            console.log(transId, userId, dishId);
        }.bind(null, transId, userId, dishId));
    },

    test: async function() {
        let dishes = await firestore.collection('transactions');
        let dishData = await dishes.get();
        dishData.forEach((d) => {
            console.log(d.id)
        })
    }
};

export default scheduledJobsController;

