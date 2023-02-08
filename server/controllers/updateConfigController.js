const {remoteConfig} = require("../services/remoteConfig.js");

const updateConfigController = {
    // req should contain the updatedHour value
    updateNotificationReturnHourThreshold: async function(req, res) {
        try {
            let updatedHour = req.query.updatedHour;
            if (!updatedHour) {
                throw new Error("updatedHour param not present");
            }
            if (isNaN(+updatedHour)) throw new Error(`"Couldn't parse ${updatedHour} as Number`);
            await remoteConfig.updateUserEmailReturnNotificationHourThreshold(updatedHour);
            return res.send("Done");
        } catch(err) {
            res.status(400).send(err.message);
        }
    }
};

module.exports = {
    updateConfigController,
}

