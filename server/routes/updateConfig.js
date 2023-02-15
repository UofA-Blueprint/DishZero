const Router = require("express").Router;
const router = Router()

const {updateConfigController} = require("../controllers/updateConfigController.js");

// updates the Config 
router.get('/notificationReturnHourThreshold', async (req, res, next) => {
    await updateConfigController.updateNotificationReturnHourThreshold(req, res);
});

router.get('/userEmailReturnNotificationJob', async (req, res, next) => {
    await updateConfigController.updateUserEmailReturnNotificationJob(req, res);
});

module.exports = {
    router
}