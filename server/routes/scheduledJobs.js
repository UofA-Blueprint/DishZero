const Router = require("express").Router;
const {scheduledJobsController} = require('../controllers/scheduledJobsController.js');
const {cronService} = require("../services/cronService");

const router = Router()

// Schedules the reminder to return the dish
// Requires transId, userId, dishId as query params
router.get('/dishCheckout', async (req, res, next) => {
    await scheduledJobsController.dishCheckoutReturnReminder(req, res);
});

module.exports = {
    router
}