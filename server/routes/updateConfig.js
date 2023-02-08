const Router = require("express").Router;
const router = Router()

const {updateConfigController} = require("../controllers/updateConfigController.js");

// updates the Config 
router.get('/notificationReturnHourThreshold', async (req, res, next) => {
    await updateConfigController.updateNotificationReturnHourThreshold(req, res);
});

router.get('/update/returnDishNotificationFrequency', async (req, res, next) => {
    await scheduledJobsController.updateDishReturnReminder(req, res);
});

module.exports = {
    router
}